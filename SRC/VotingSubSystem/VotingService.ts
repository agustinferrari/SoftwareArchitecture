import {VoteIntentEncrypted} from "./Models/VoteIntentEncrypted";
import {VoteIntent} from "./Models/VoteIntent";

export class VotingService{

     handleVote(voteIntentEncrypted: VoteIntentEncrypted){
        if(voteIntentEncrypted.ci == "1"){
            console.log("Vote for candidate 1");
        }else{
            throw new Error("Invalid candidate CI");
        }
        // voteIntent = encryptor.decrypt(voteIntentEncrypted.data);
        //try
            // validate(voteIntent)
            // send to bull
             // response
    }
}
