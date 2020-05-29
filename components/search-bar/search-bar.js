// @flow
import React from "react";
import { StyleSheet, View, TextInput, TouchableHighlight, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { defaultStyles } from "../../styles/default-styles";
import { Button, Lightbox } from "@shoutem/ui";

const localStyles = {
    searchBar: {
        margin: 10,
        padding: 0,
        height: 45
    },
    searchTerm: {
        backgroundColor: "white",
        textAlign: "left",
        padding: 10
    },
    iconStyle: {
        height: 40,
        width: 40,
        padding: 2,
        color: "white",
        textAlign: "center"
    }
};
const styles = StyleSheet.create(Object.assign({}, defaultStyles, localStyles));

type PropsType = {
    help?: React$Element<any>,
    searchTerm: ?string,
    search: string => void,
    userLocation: Object
};

export const SearchBar = ({ help, userLocation, searchTerm = "", search }: PropsType): React$Element<View> => (
    <View style={ styles.searchBar }>
        <View style={ { flex: 1, flexDirection: "row", alignItems: "flex-start", justifyContent: "center" } }>
            { // Note: the lightbox is nice, but it does not close on android. Find a work-around before implementing.
                Boolean(help) && (
                <Lightbox
                    renderHeader={ close => (
                        <Button style={ {
                            position: "absolute",
                            top: 40,
                            right: 10,
                            borderStyle: "solid",
                            borderColor: "#AAA",
                            borderRadius: 40,
                            borderWidth: 1,
                            backgroundColor: "#FFF",
                            padding: 10,
                            height: 50,
                            width: 50,
                            shadowColor: "#000",
                            shadowOffset: {
                                width: 0,
                                height: 2
                            },
                            shadowOpacity: 0.25,
                            shadowRadius: 3.84,
                            elevation: 5
                        } } onPress={ close }>
                            <Ionicons
                                name={ Platform.OS === "ios" ? "ios-close" : "md-close" }
                                size={ 30 }
                                color="#888"
                            />
                        </Button>) }
                    backgroundColor={ "rgba(52, 52, 52, 0.8)" }
                    pinchToZoom={ false }
                    renderContent={ () => (help) }>
                    <Ionicons
                        name={ Platform.OS === "ios" ? "ios-help-circle-outline" : "md-help-circle-outline" }
                        size={ 36 }
                        style={ styles.iconStyle }/>
                </Lightbox>) }
            <View style={ { flex: 1, flexDirection: "column", justifyContent: "center", paddingTop: 2 } }>
                <TextInput
                    keyBoardType={ "default" }
                    onChangeText={ search }
                    placeholder={ "Search" }
                    style={ styles.searchTerm }
                    value={ searchTerm }
                    underlineColorAndroid={ "transparent" }
                />
            </View>
            <TouchableHighlight
                onPress={ () => {
                    search("");
                } }
                style={ { height: 36, width: 40, paddingLeft: 2, paddingRight: 2, paddingBottom: 2, marginLeft: 2 } }>
                <Ionicons
                    name={ Platform.OS === "ios" ? "ios-close-circle-outline" : "md-close-circle-outline" }
                    size={ 36 }
                    style={ styles.iconStyle }/>
            </TouchableHighlight>
            <TouchableHighlight
                onPress={ () => {
                    search(userLocation.townId || "");
                } }
                style={ { height: 36, width: 40, paddingLeft: 2, paddingRight: 2, paddingBottom: 2, marginLeft: 2 } }>
                <Ionicons
                    name={ Platform.OS === "ios" ? "md-locate" : "md-locate" }
                    size={ 36 }
                    style={ styles.iconStyle }/>
            </TouchableHighlight>
        </View>
    </View>
);

