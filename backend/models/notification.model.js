import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        messageContent: {
            type: String,
            enum: ["text", "media"],
            required: true
        },
        messageId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
            required: true
        },
        status: {
            type: String,
            enum: ["send", "delivered", "seen"],
            required: true
        }
    },
    { timestamps: true }
);
notificationSchema.index({ receiverId: 1, status: 1 });

notificationSchema.post("findOneAndUpdate", async function (doc) {
    if (doc && doc.status === "seen") {
        await doc.deleteOne();
    }
});


export const Notification = mongoose.model("Notification", notificationSchema);
