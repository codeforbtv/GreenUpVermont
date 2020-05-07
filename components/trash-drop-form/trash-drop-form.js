// @flow
import React, { useState, Fragment } from "react";
import MiniMap from "../mini-map";
import {
    TouchableOpacity,
    StyleSheet,
    TextInput,
    ScrollView,
    Modal,
    Picker
} from "react-native";
import EnableLocationServices from "../../components/enable-location-services";
import { Text, Button, Title, Divider, View } from "@shoutem/ui";
import { defaultStyles } from "../../styles/default-styles";
import { SafeAreaView } from "react-native";
import TownInformation from "../town-information";
import SiteSelector from "../site-selector";
import * as R from "ramda";
import Site from "../site";
import ButtonBar from "../button-bar";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import TagToggle from "../../components/tag-toggle";
import { isInGreenUpWindow } from "../../libs/green-up-day-calucators"; // TODO: Add out of window warning
import { findTownIdByCoordinates } from "../../libs/geo-helpers";
import { isProductionEnv } from "../../libs/app-utils";

type LocationType = { id: string, name: string, coordinates: { longitude: number, latitude: number }, error: any };

const myStyles = {};
const combinedStyles = Object.assign({}, defaultStyles, myStyles);

const styles = StyleSheet.create(combinedStyles);

type PropsType = {
    onSave: TrashDropType => void,
    currentUser: UserType,
    townData: Object,
    trashCollectionSites: Object, // Array<Object>,
    userLocation?: LocationType,
    teamOptions: { id: string, name: ?string }[]
};

export const TrashDropForm = ({ teamOptions, onSave, currentUser, townData, trashCollectionSites, userLocation }: PropsType): React$Element<View> => {
    const defaultTeam = Object.values(currentUser.teams || {})[0] || {};
    const [drop, setDrop] = useState({
        id: null,
        active: true,
        teamId: (defaultTeam || {}).id || null,
        collectionSiteId: null,
        created: new Date(),
        wasCollected: false,
        location: userLocation.coordinates,
        coordinates: userLocation.coordinates,
        tags: [],
        createdBy: { uid: currentUser.uid, email: currentUser.email },
        bagCount: 1
    });
    const [refKey, setRefKey] = useState(0);
    const [modal, setModal] = useState(null);
    const currentTownId = userLocation && userLocation.coordinates ? findTownIdByCoordinates(userLocation.coordinates) : "";

    const locationExists = userLocation && userLocation.coordinates && userLocation.coordinates.latitude && userLocation.coordinates.longitude;
    const initialMapLocation = locationExists
        ? {
            latitude: Number(userLocation.coordinates.latitude),
            longitude: Number(userLocation.coordinates.longitude),
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
        }
        : null;

    const toggleTag = (tag: string): (any=>any) => () => {
        const hasTag = (drop.tags || []).indexOf(tag) > -1;
        const tags = hasTag
            ? (drop.tags || []).filter((_tag: string): boolean => _tag !== tag)
            : (drop.tags || []).concat(tag);
        setDrop({ ...drop, tags });
    };


    const currentTown = townData.find(t => t.townId === currentTownId);
    if (typeof currentTown === "undefined") {
        return (
            <Fragment>
                <SafeAreaView style={ {
                    borderTopWidth: 1,
                    borderStyle: "solid",
                    borderColor: "white",
                    flex: 1,
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    paddingTop: 20
                } }>
                    <Text style={ { color: "white" } }>Having trouble locating you. Please try again in a bit!</Text>
                </SafeAreaView>
            </Fragment>
        );
    }
    const selectedSite = trashCollectionSites.find(site => site.id === drop.collectionSiteId);
    const townHasSites = trashCollectionSites.some(site => site.townId === currentTownId);

    const getDropButtons = R.cond([
        [
            R.always(townHasSites && currentTown.allowsRoadside),
            () => (
                <View style={ { flex: 1, flexDirection: "row", justifyContent: "space-between" } }>
                    <TouchableOpacity
                        style={
                            {
                                padding: 10,
                                backgroundColor: "#333",
                                flex: 0.49,
                                flexDirection: "row",
                                justifyContent: "space-between"
                            }
                        }
                        onPress={ () => {
                            setDrop({ ...drop, location: userLocation });
                        } }>
                        <FontAwesome
                            size={ 30 }
                            style={ { color: "#DDD", marginRight: 10 } }
                            name={ "map-marker" }/>
                        <View style={ { flex: 1, justifyContent: "center" } }>
                            <Text style={ { color: "#DDD", flexWrap: "wrap" } }>Drop Bags Here</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={
                            {
                                padding: 10,
                                backgroundColor: "#333",
                                flex: 0.49,
                                flexDirection: "row",
                                justifyContent: "space-between"
                            }
                        }
                        onPress={ () => {
                            setModal("site-selector");
                        } }>
                        <FontAwesome
                            style={ { color: "#DDD", marginRight: 10 } } size={ 30 }
                            name={ "map-signs" }/>
                        <View style={ { flex: 1, justifyContent: "center" } }>
                            <Text style={ { flex: 1, color: "#DDD", flexWrap: "wrap" } }>Find Collection Site</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            )
        ],
        [
            R.always(currentTown.allowsRoadside),
            () => (
                <Button styleName="confirmation secondary">
                    <FontAwesome size={ 30 } style={ { color: "#DDD", marginBottom: 10 } } name={ "map-marker" }/>
                    <Text>Drop Bag Here</Text>
                </Button>
            )
        ],
        [
            R.T,
            () => (
                <View style={ { width: "100%", height: 60 } }>
                    <Button
                        styleName={ "full-width  secondary" }
                        onPress={ () => {
                            setModal("site-selector");
                        } }>
                        <MaterialCommunityIcons
                            name="earth"
                            size={ 25 }
                            style={ { marginRight: 10 } }
                            color={ "#555" }
                        />
                        <Text>{ "Find a trash collection site" }</Text>
                    </Button>
                </View>)
        ]
    ]);

    // setRefKey(0);

    const clickOnMap = (loc) => {
        drop.coordinates = loc;
        drop.location = loc;
        // alert(JSON.stringify(loc));
        setDrop(drop);
        setRefKey(refKey + 1);
    };

    return (
        <Fragment>
            {
                R.cond(
                    [
                        [
                            () => (!(isInGreenUpWindow()) && isProductionEnv()),
                            () => (
                                <Fragment>
                                    <SafeAreaView style={ {
                                        borderTopWidth: 1,
                                        borderStyle: "solid",
                                        borderColor: "white",
                                        flex: 1,
                                        flexDirection: "column",
                                        justifyContent: "flex-start",
                                        padding: 50

                                    } }>
                                        <Text style={ { color: "white" } }>
                                            Come back to this screen during Green Up week to record your bags!
                                        </Text>
                                    </SafeAreaView>
                                </Fragment>
                            )
                        ],
                        [
                            R.T,
                            () => (
                                <SafeAreaView
                                    style={ {
                                        borderTopWidth: 1,
                                        borderStyle: "solid",
                                        borderColor: "white",
                                        flex: 1,
                                        flexDirection: "column",
                                        justifyContent: "flex-end"
                                    } }>
                                    <ScrollView style={ { flexGrow: 1, padding: 20 } }>
                                        {
                                            R.cond(
                                                [
                                                    [() => teamOptions.length > 1,
                                                        () => (
                                                            <Fragment>
                                                                <Text style={ styles.label }>
                                                                    { "This drop is for team:" }
                                                                </Text>
                                                                <View
                                                                    style={ { backgroundColor: "white", padding: 20 } }>
                                                                    <Picker
                                                                        selectedValue={ drop.teamId }
                                                                        onValueChange={ pvalue => setDrop({
                                                                            ...drop,
                                                                            teamId: pvalue
                                                                        }) }
                                                                        style={ {
                                                                            modal: {
                                                                                backgroundColor: "#F00",
                                                                                color: "red"
                                                                            },
                                                                            selectedOption: {
                                                                                marginTop: 0,
                                                                                height: 90,
                                                                                "shoutem.ui.Text": {
                                                                                    color: "#333",
                                                                                    fontSize: 20
                                                                                }
                                                                            }
                                                                        } }>
                                                                        {
                                                                            teamOptions.map(
                                                                                (entry: Object, index: number): React$Element<any> => (
                                                                                    <Picker.Item
                                                                                        key={ index }
                                                                                        label={ entry.name }
                                                                                        value={ entry.id }/>
                                                                                )
                                                                            )
                                                                        }
                                                                    </Picker>

                                                                </View>
                                                            </Fragment>
                                                        )
                                                    ],
                                                    [() => teamOptions.length === 1,
                                                        () => (
                                                            <Fragment>
                                                                <Text style={ styles.label }>
                                                                    { "This drop is for team:" }
                                                                </Text>
                                                                <View
                                                                    style={ { backgroundColor: "white", padding: 20 } }>
                                                                    <Title> { teamOptions[0].name } </Title>
                                                                </View>
                                                            </Fragment>
                                                        )
                                                    ],
                                                    [
                                                        R.T,
                                                        () => null
                                                    ]
                                                ]
                                            )()
                                        }

                                        <View style={ { height: 100, marginTop: 20, marginBottom: 20 } }>
                                            <Text style={
                                                {
                                                    lineHeight: 60,
                                                    height: 60,
                                                    color: "white",
                                                    textAlign: "center"
                                                } }>
                                                { "How many bags are you dropping?" }
                                            </Text>
                                            <View style={ { flex: 1, justifyContent: "center", flexDirection: "row" } }>
                                                <TouchableOpacity
                                                    onPress={ () => {
                                                        const bagCount = isNaN(Number(drop.bagCount)) ? 1 : (Number(drop.bagCount) < 2 ? 1 : Number(drop.bagCount) - 1);
                                                        setDrop({ ...drop, bagCount });
                                                    }
                                                    }
                                                    style={ { height: 100, marginRight: 10 } }>
                                                    <MaterialCommunityIcons
                                                        size={ 40 }
                                                        style={ { color: "#EEE" } }
                                                        name={ "chevron-down-circle" }
                                                    />
                                                </TouchableOpacity>
                                                <TextInput
                                                    underlineColorAndroid="transparent"
                                                    value={ isNaN(drop.bagCount) ? "" : drop.bagCount.toString() }
                                                    keyboardType="numeric"
                                                    placeholder="#"
                                                    style={ {
                                                        color: "#000",
                                                        width: 80,
                                                        textAlign: "center",
                                                        backgroundColor: "white",
                                                        fontSize: 20
                                                    } }
                                                    onChangeText={ (text: string) => {
                                                        const bagCount = isNaN(Number(text)) ? 1 : Number(text);
                                                        setDrop({ ...drop, bagCount });
                                                    }
                                                    }
                                                />
                                                <TouchableOpacity
                                                    onPress={ () => {
                                                        const bagCount = isNaN(Number(drop.bagCount)) ? 1 : (Number(drop.bagCount) < 1 ? 1 : Number(drop.bagCount) + 1);
                                                        setDrop({
                                                            ...drop,
                                                            bagCount
                                                        });
                                                    } }
                                                    style={ { height: 100, marginLeft: 10 } }>
                                                    <MaterialCommunityIcons
                                                        size={ 40 } style={ { color: "#EEE" } }
                                                        name={ "chevron-up-circle" }/>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        <Text style={ styles.label }>Other Items</Text>
                                        <TagToggle
                                            tag={ "bio-waste" }
                                            text={ "Needles/Bio-Waste" }
                                            drop={ drop }
                                            style={ { margin: 0, paddingTop: 20, paddingBottom: 0 } }
                                            onToggle={ toggleTag("bio-waste") }/>
                                        <TagToggle
                                            tag={ "tires" }
                                            text={ "Tires" }
                                            drop={ drop }
                                            style={ { margin: 0, padding: 0 } }
                                            onToggle={ toggleTag("tires") }/>
                                        <TagToggle
                                            tag={ "large" }
                                            text={ "Large Object" }
                                            drop={ drop }
                                            style={ { margin: 0, paddingBottom: 20, paddingTop: 0 } }
                                            onToggle={ toggleTag("large") }/>


                                        <TownInformation townInfo={ currentTown } hideOnError={ true }/>

                                        <Divider styleName={ "line" } style={ { marginTop: 20, marginBottom: 20 } }/>

                                        { getDropButtons() }

                                        {
                                            R.cond(
                                                [
                                                    [
                                                        R.always(Boolean(drop.collectionSiteId)),
                                                        () => (
                                                            <View style={ {
                                                                backgroundColor: "white",
                                                                padding: 10,
                                                                marginTop: 10
                                                            } }>
                                                                <Text
                                                                    style={ {
                                                                        fontSize: 20,
                                                                        marginBottom: 10
                                                                    } }>{ "I'm taking my trash here:" }</Text>
                                                                <Site site={ selectedSite } town={ currentTown }/>
                                                            </View>
                                                        )
                                                    ],
                                                    [
                                                        () => Boolean(userLocation.error),
                                                        () => (<EnableLocationServices
                                                            errorMessage={ userLocation.error }/>)
                                                    ],
                                                    [
                                                        () => !Boolean(initialMapLocation),
                                                        () => (
                                                            <View style={ [styles.frame, {
                                                                display: "flex",
                                                                justifyContent: "center"
                                                            }] }>
                                                                <Text style={ {
                                                                    fontSize: 20,
                                                                    color: "white",
                                                                    textAlign: "center"
                                                                } }>
                                                                    { "...Locating You" }
                                                                </Text>
                                                            </View>
                                                        )
                                                    ],
                                                    [
                                                        R.T,
                                                        () => (
                                                            <MiniMap
                                                                initialLocation={ {
                                                                    ...((userLocation || {
                                                                        coordinates: {
                                                                            latitude: 0.0,
                                                                            longitude: 0.0
                                                                        }
                                                                    }).coordinates),
                                                                    latitudeDelta: 0.0922,
                                                                    longitudeDelta: 0.0421
                                                                } }
                                                                pinsConfig={ [drop] }
                                                                onMapClick={ clickOnMap }
                                                                refKey={ refKey }
                                                                style={ {
                                                                    flex: 1,
                                                                    alignItems: "center",
                                                                    justifyContent: "center",
                                                                    alignSelf: "stretch",
                                                                    marginTop: 20
                                                                } }
                                                            />
                                                        )
                                                    ]
                                                ]
                                            )()
                                        }

                                        <View style={ { height: 100 } }/>
                                    </ScrollView>
                                    <ButtonBar buttonConfigs={
                                        [
                                            {
                                                onClick: (() => {
                                                    onSave(drop);
                                                }),

                                                text: "Save"
                                            }
                                        ] }>
                                        <Text>Tag My Bag</Text>
                                    </ButtonBar>
                                </SafeAreaView>
                            )
                        ]
                    ]
                )()
            }
            <Modal animationType={ "slide" }
                onRequestClose={ () => {
                    setModal(null);
                } }
                transparent={ false }
                visible={ modal === "site-selector" }>
                <SafeAreaView>
                    <SiteSelector
                        onSelect={ site => {
                            setDrop({ ...drop, collectionSiteId: site.id, location: null });
                            setModal(null);
                        }
                        }
                        sites={ trashCollectionSites || [] }
                        userLocation={ userLocation || {} }
                        towns={ townData }
                        close={ () => {
                            setModal(null);
                        }
                        }
                        value={ selectedSite }
                    />
                </SafeAreaView>
            </Modal>
        </Fragment>
    );
};

