// @flow
import { isValidDate } from "../libs/validators";
import md5 from "md5-hash";
import anonymous from "../assets/images/anonymous.png";

export const defaultAvatar = anonymous;
export const getGravatar = (email: string): string => (!email ? defaultAvatar : `https://www.gravatar.com/avatar/${ md5(email.trim().toLowerCase()) }?d=mm`);

export default class User {
    uid: ?string;
    displayName: ?string;
    updated: ?Date;
    email: ?string;
    photoURL: ?string;
    teams: ?Object;
    bio: ?string;
    created: ?Date;
    grantMarketingConsent: ?boolean;
    marketingConsentUpdatedOn: ?Date;

    constructor(args: Object = {}) {
        this.uid = typeof args.uid === "string" || typeof args.id === "string"
            ? args.uid || args.id
            : null;
        this.displayName = typeof args.displayName === "string"
            ? args.displayName.trim()
            : null;
        this.email = typeof args.email === "string"
            ? args.email.trim().toLowerCase()
            : null;
        this.bio = typeof args.bio === "string"
            ? args.bio.slice(0, 144).trim() // max-length is 144 characters
            : null;
        this.created = isValidDate(args.created)
            ? new Date(args.created)
            : null;
        this.updated = isValidDate(new Date(args.updated))
            ? new Date(args.updated)
            : null;
        this.teams = args.teams || {};
        this.photoURL = typeof args.photoURL === "string"
            ? args.photoURL
            : getGravatar(args.email);
        this.grantMarketingConsent = typeof args.grantMarketingConsent === "boolean"
            ? args.grantMarketingConsent
            : null;
        this.marketingConsentUpdatedOn = args.marketingConsentUpdatedOn || null;
    }

    static create(args: ?Object, uid?: string): UserType {
        const _args = JSON.parse(JSON.stringify(args || {}));
        if (Boolean(uid)) {
            _args.uid = uid;
        }
        return JSON.parse(JSON.stringify(new User(_args)));
    }


}
