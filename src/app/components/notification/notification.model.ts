export class Notification {
    public inviterUsername: string;
    public inviteDate: Date;
    public invitation: boolean;
    public documentName: string;

    constructor(inviterUsername: string, inviteDate: Date, invitation: boolean, documentName: string) {
        this.inviterUsername = inviterUsername;
        this.inviteDate = inviteDate;
        this.invitation = invitation;
        this.documentName = documentName;
    }
}