import {VoteIntent} from "./Models/VoteIntent";

export class VotingService{

     handleVote(voteIntent: VoteIntent){
         console.log("llego")
        if(voteIntent.candidateCI == "1"){
            console.log("Vote for candidate 1");
        }else{
            throw new Error("Invalid candidate CI");
        }
    }
}
