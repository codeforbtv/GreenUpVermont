// @flow
import React, { useEffect, useState } from "react";
import { Modal, View } from "react-native";
import { ListView } from "@shoutem/ui";
import { TownDisposalDetails } from "../town-disposal-details/town-disposal-details";
import type Location from "../../models/location";
import { searchArray } from "../../libs/search";
import SearchBar from "../search-bar";
import TownListItem from "../town-list-item";
import TrashCollectionSite from "../../models/trash-collection-site";

const searchableFields = ["name", "townName", "address", "townId"];

type TownInfoType = {
    townName: ?string,
    notes: ?string,
    allowsRoadside: boolean,
    townId: string,
    dropOffInstructions: ?string,
    collectionSites: TrashCollectionSite[]
};

type PropsType = { userLocation: Location, townInfo: TownInfoType[] };

export const DisposalSiteSelector = ({ userLocation, townInfo }: PropsType): React$Element<any> => {
    const [selectedTown, setSelectedTown] = useState();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [searchResults, setSearchResults] = useState(townInfo);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const spotsFound = searchArray(searchableFields, townInfo, searchTerm);
        setSearchResults(spotsFound);
    }, [searchTerm]);

    return (
        <View>
            <SearchBar
                searchTerm={ searchTerm }
                search={ setSearchTerm }
                userLocation={ userLocation }
            />

            <ListView
                data={ searchTerm ? searchResults : townInfo }
                renderRow={ town => (
                    <TownListItem
                        town={ town }
                        onClick={ () => {
                            setSelectedTown(town);
                            setIsModalVisible(true);
                        } }/>
                ) }
            />
            <Modal
                animationType={ "slide" }
                onRequestClose={ (): string => ("this function is required. Who knows why?") }
                transparent={ false }
                visible={ isModalVisible }>
                <TownDisposalDetails
                    closeModal={ () => {
                        setIsModalVisible(false);
                    } }
                    town={ selectedTown }/>
            </Modal>
        </View>
    );
};
