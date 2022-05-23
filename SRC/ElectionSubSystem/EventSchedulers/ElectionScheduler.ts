import { scheduleJob, RecurrenceRule } from "node-schedule";
import { ElectionDTO } from "../../Common/Domain";

export class ElectionScheduler{

   public scheduleStartElection(election: ElectionDTO){            
        scheduleJob(this.parseDate(election.startDate),()=>{
            console.log("start election" + election.id);
        } )
    }

    public scheduleEndElection(election: ElectionDTO){            
        scheduleJob(this.parseDate(election.endDate),()=>{
            console.log("end election" + election.id);
        } )
    }

    private parseDate(myDateStr: string):Date{
        const dateStr = myDateStr;
        const [dateComponents, timeComponents] = dateStr.split(' ');
        
        const [year, month, day] = dateComponents.split('-');
        const [hours, minutes, seconds] = timeComponents.split(':');
        
        const date = new Date(+year, +month - 1, +day, +hours, +minutes, +seconds); 
        return date;
    }
}