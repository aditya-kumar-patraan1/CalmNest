import { moodEntryModel } from "../Models/moodEntry.js";


const addMoodJournalEntry = async (req,res) => {
    try{

        const data = req.body;
        const id = req.userId;

        if (!id) {
            return res.send({
                status: 0,
                "msg": "user does'nt exist"
            })
        }

        data["userId"] = id;

        // console.log(data);

        const info = new moodEntryModel(data);
        await info.save();

        return res.send({
            status:1
        });

    }
    catch(e){
        return res.send({
            status:0,
            "msg":"error occured"
        })       
    }
}

const getMoodEntries = async (req,res) => {
    try{

        const id = req.userId;

        if (!id) {
            return res.send({
                status: 0,
                "msg": "user does'nt exist"
            });
        }

        // console.log("my id is : ",id);

        const allMoodEntries = await moodEntryModel.find({userId:id});
        // console.log("all mood entries : ",allMoodEntries);

        return res.send({
            status:1,
            allMoodEntries
        })

    }
    catch(e){
        return res.send({
            status:0,
            "msg":"error occured"
        })       
    }
}

export {addMoodJournalEntry,getMoodEntries};