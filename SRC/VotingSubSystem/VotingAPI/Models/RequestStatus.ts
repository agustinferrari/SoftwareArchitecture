import { scheduleJob, RecurrenceRule } from "node-schedule";

export class RequestStatus{
    steps : string[];
    startTimeStamp: Date;
    endTimeStamp: Date;
    name:string
    public constructor(name: string,timeStamp:Date, seconds?: number){
        this.steps = [];
        this.name = name;
        this.endTimeStamp = new Date();
        if(seconds){
            this.endTimeStamp.setSeconds(this.endTimeStamp.getSeconds() + seconds);
        }else{
            this.endTimeStamp.setSeconds(this.endTimeStamp.getSeconds() + 2);
        }

        this.startTimeStamp = timeStamp;
    }

    public startTime(res:any){
        scheduleJob(this.name, this.endTimeStamp, () => {
            res.status(500).send("Request timed out on: " + this.steps[this.steps.length - 1]);
        });
    }
}