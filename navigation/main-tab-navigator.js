import React from "react";
import { Platform } from "react-native";
import {createBottomTabNavigator } from "react-navigation";
import TabBarIcon from "../components/tab-bar-icon";
import TeamsStack from "./teams-stack";
import MenuStack from "./menu-stack";
import MessagesStack from "./messages-stack";
import TrashTrackerStack from "./trash-tracker-stack";

type focusedType = { focused: boolean };

/** * Messages ***/
MessagesStack.navigationOptions = {
    tabBarLabel: "Messages",
    tabBarIcon: ({ focused }: focusedType) => (
        <TabBarIcon
            focused={ focused }
            name={
                Platform.OS === "ios"
                    ? `ios-chatbubbles${focused ? "" : ""}`
                    : "md-chatbubbles"
            }
        />
    )
};


/** * Teams ***/
TeamsStack.navigationOptions = {
    tabBarLabel: "Teams",
    tabBarIcon: ({ focused }: focusedType) => (
        <TabBarIcon
            focused={ focused }
            name={
                Platform.OS === "ios" ? `ios-contacts${focused ? "" : ""}` : "md-contacts"
            }
        />
    )
};


TrashTrackerStack.navigationOptions = {
    tabBarLabel: "Trash",
    tabBarIcon: ({ focused }: focusedType) => (
        <TabBarIcon
            focused={ focused }
            name={
                Platform.OS === "ios" ? `ios-pin${focused ? "" : ""}` : "md-pin"
            }
        />
    )
};

MenuStack.navigationOptions = {
    tabBarLabel: "Menu",
    tabBarIcon: ({ focused }: focusedType) => (
        <TabBarIcon
            focused={ focused }
            name={ Platform.OS === "ios" ? "ios-menu" : "md-menu" }
        />
    )
};

export default createBottomTabNavigator({
    MessagesStack,
    TeamsStack,
    TrashTrackerStack,
    MenuStack
});
