export class VoteInfo{
    frontendTimeStamp : Date;
    backendTimeStamp : Date;
    ci: string;
    electionIdentifier: string;
    randomIdentifier: string;
    constructor(){
        this.frontendTimeStamp = new Date();
        this.backendTimeStamp = new Date();
        this.ci = "";
        this.electionIdentifier = "";
        this.randomIdentifier = "";
    }
}