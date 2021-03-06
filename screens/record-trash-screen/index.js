// @flow
import React, { useState } from "react";
import * as R from "ramda";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import EnableLocationServices from "../../components/enable-location-services";
import {
    StyleSheet,
    Text,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TrashDrop from "../../models/trash-drop";
import * as actionCreators from "../../action-creators/map-action-creators";
import { defaultStyles } from "../../styles/default-styles";
import * as constants from "../../styles/constants";

import TrashDropForm from "../../components/trash-drop-form";
import WatchGeoLocation from "../../components/watch-geo-location";

const styles = StyleSheet.create(defaultStyles);

type PropsType = {
    actions: Object,
    drops: Array<Object>,
    cleanAreas: Array<Object>,
    cleanAreasToggle: boolean,
    collectedTrashToggle: boolean,
    currentUser: Object,
    supplyDistributionSites: Object,
    supplyPickupToggle: boolean,
    townData: Object,
    trashCollectionSites: Object,
    trashDropOffToggle: boolean,
    myTrashToggle: boolean,
    uncollectedTrashToggle: boolean,
    userLocation: Object
};

const RecordTrashScreen = (
    {
        actions,
        currentUser,
        townData,
        trashCollectionSites,
        userLocation
    }: PropsType): React$Element<any> => {

    const [drop, setDrop] = useState({
        id: null,
        location: {},
        tags: [],
        bagCount: 1,
        wasCollected: false,
        createdBy: { uid: currentUser.uid, email: currentUser.email }
    });


    const closeModal = () => {
        const newDrop = TrashDrop.create({
            id: null,
            location: {},
            tags: [],
            bagCount: 1,
            wasCollected: false,
            createdBy: { uid: currentUser.uid, email: currentUser.email }
        });
        setDrop(newDrop);
    };


    const saveTrashDrop = (myDrop: Object) => {
        if (myDrop.id) {
            actions.updateTrashDrop(myDrop);
        } else {
            actions.dropTrash(TrashDrop.create(myDrop));
        }
        closeModal();
    };


    const initialMapLocation = userLocation
        ? {
            latitude: Number(userLocation.coordinates.latitude),
            longitude: Number(userLocation.coordinates.longitude),
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
        }
        : null;


    const content = R.cond([
        [
            () => Boolean(userLocation.error),
            () => (<EnableLocationServices errorMessage={ userLocation.error }/>)
        ],
        [() => !Boolean(initialMapLocation), () => (
            <View style={ [styles.frame, { display: "flex", justifyContent: "center" }] }>
                <Text style={ { fontSize: 20, color: "white", textAlign: "center" } }>
                    { "...Locating You" }
                </Text>
            </View>)],
        [R.T, () => (
            <TrashDropForm
                currentUser={ currentUser }
                location={ userLocation }
                onSave={ saveTrashDrop }
                onCancel={ closeModal }
                townData={ townData }
                trashCollectionSites={ trashCollectionSites }
                trashDrop={ drop }
            />)
        ]
    ])();


    return (
        <SafeAreaView style={ styles.container }>
            <WatchGeoLocation/>
            { content }
        </SafeAreaView>
    );
};

RecordTrashScreen.navigationOptions = {
    title: "Trash Map",
    headerStyle: {
        backgroundColor: constants.colorBackgroundDark
    },
    headerTintColor: "#fff",
    headerTitleStyle: {
        fontFamily: "Rubik-Regular",
        fontWeight: "bold",
        fontSize: 20,
        color: constants.colorHeaderText
    },
    headerBackTitleStyle: {
        fontFamily: "Rubik-Regular",
        fontWeight: "bold",
        fontSize: 20,
        color: constants.colorHeaderText
    }
};

const mapStateToProps = (state: Object): Object => {

    const trashCollectionSites = state.trashCollectionSites.sites;
    const drops = (state.trashTracker.trashDrops || [])
        .filter((drop: TrashDrop): boolean => Boolean(drop.location && drop.location.longitude && drop.location.latitude));
    const townData = state.towns.townData;
    return {
        currentUser: state.login.user,
        drops: drops,
        townData,
        trashCollectionSites,
        userLocation: state.userLocation
    };
};

const mapDispatchToProps = (dispatch: Dispatch<Object>): Object => ({ actions: bindActionCreators(actionCreators, dispatch) });

export default connect(mapStateToProps, mapDispatchToProps)(RecordTrashScreen);