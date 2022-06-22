export class TimeStampHelper {
    queryResult: any;
    code: number;
    requestTimeStamp: Date;
    responseTimeStamp: Date;
    processingTime: number;


    constructor(result : any, code?:number, requestTimeStamp?:Date, responseTimeStamp?:Date){
        if(code && requestTimeStamp && responseTimeStamp){
            this.queryResult = result;
            this.code = code;
            this.requestTimeStamp = requestTimeStamp;
            this.responseTimeStamp = responseTimeStamp;
            this.processingTime = responseTimeStamp.valueOf() - requestTimeStamp.valueOf();
        }else{
            this.queryResult = result.queryResult;
            this.code = result.code;
            this.requestTimeStamp = result.requestTimeStamp;
            this.responseTimeStamp = result.responseTimeStamp;
            this.processingTime = result.processingTime;
        }
    }
}