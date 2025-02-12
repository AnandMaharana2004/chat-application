import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
    participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            require: true,
        }
    ],
    isGroup : {
        type : Boolean,
        default : false
    },
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
        require: true
    }
},
    {
        timestamps: true
    })

export const Conversation = mongoose.model("Conversation", conversationSchema)