import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: false
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        conversation: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Conversation",
            required: true
        },
        media: [
            {
                url: { type: String, required: true },
                type: {
                    type: String,
                    enum: ["image", "video", "audio", "file"],
                    required: false
                },
                name: { type: String }, // Optional: Original file name
                size: { type: Number }, // Optional: File size in bytes
                height: { type: Number },
                width: { type: Number }
            },
        ],
        deletedFor: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        isDeletedForEveryone: {
            type: Boolean,
            default: false
        },
    },
    {
        timestamps: true
    }
);

export const Message = mongoose.model("Message", MessageSchema);
