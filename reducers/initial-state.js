// @flow
import { getCurrentGreenUpDay } from "../libs/green-up-day-calucators";
import moment from "moment";

export default {
    about: {
        date: moment(getCurrentGreenUpDay()).utc().format("dddd, MMMM Do YYYY"),
        marketingPermissions: {
            permissionText: "We would love to keep in touch by email. Would you be interested in receiving our latest news by email?",
            noButtonText: "No thanks :(",
            yesButtonText: "Yes please"
        },
        contactUs: { addressLine1: "", addressLine2: "", email: "", fullName: "", phoneNumber: "" }
    },
    loading: {
        initialAuthChecked: false,
        isInitialized: false,
        loadingError: null,
        skipLoadingScreen: false,
        setupMessagesListener: false,
        setupTeamsListener: false,
        setupMyTeamsListeners: false,
        setupProfileListener: false,
        setupInvitationsListener: false
    },
    login: {
        userIsLoggedIn: null,
        initialAuthChecked: false,
        creatingUser: false,
        createUserError: null,
        user: null,
        isLoggingInViaSSO: false
    },
    profile: {},
    messages: {
        messages: {},
        loaded: false,
        invitationsLoaded: false,
        teamsLoaded: false
    },
    networkStatus: { isOnline: null },
    teamMembers: {},
    teamMembersLoaded: false,
    teamRequests: {},
    teams: { teams: {}, teamMembers: {}, contact: [], selectedTeam: null, locations: [] },
    towns: { townData: {} },
    trashTracker: {
        trashDrops: [],
        location: null,
        collectedTrashToggle: false,
        supplyPickupToggle: true,
        uncollectedTrashToggle: true,
        trashDropOffToggle: true,
        myTrashToggle: true,
        cleanAreasToggle: true
    },
    teamSearchResults: [],
    selectedTeam: null,
    session: {}
};