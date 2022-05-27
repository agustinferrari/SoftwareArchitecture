import { ElectionDTO } from "../Common/Domain";
import {ElectionScheduler} from "./EventSchedulers/ElectionScheduler";
import {ElectionCommand} from "./DataAccess/Command/ElectionCommand";

export class ElectionManager{

    public async handleElections(elections : ElectionDTO[]) : Promise<void>{
        elections.forEach(election => {
            this.handleElection(election);
        });
        console.log("es o no")
    }

    public startElection(election: ElectionDTO) : void{
        console.log(election.id + " started");
        // setear iniciada
        //enviar acta de inicio
    }

    public endElection(election: ElectionDTO) : void{
        console.log(election.id + " ended");        
        // setear fin
        //enviar acta de fin
    }

    private async handleElection(election : ElectionDTO) : Promise<void>{
        try {
            await this.validateElection(election);
        }catch(e:any){
            console.log(e.message)
        }
        const scheduler = new ElectionScheduler(this);
        const commander = new ElectionCommand();

        scheduler.scheduleStartElection(election);
        scheduler.scheduleEndElection(election);
        commander.addElection(election);
    }

    private validateElection(election:ElectionDTO) : void{
        console.log(election.id + " validada");
    }
}

    