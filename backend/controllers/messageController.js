import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import AsyncHandler from "../utils/AsyncHandler.js";
import { Conversation } from "../models/conversation.model.js"
import { Message } from "../models/message.model.js"
import { User } from "../models/usre.model.js"
import { getResiverSocketId, io } from "../socket/socket.js";
import { uploadOnCloudinary, deleteFromCloudinary } from '../utils/Cloudinary.js'
import { ConvertToObjectId, checkMongoId } from "../utils/Validate.js";


// const sendMessage = AsyncHandler(async (req, res) => {
//     const senderId = req.userId
//     const resiverId = req.params.id
//     const { message } = req.body

//     if (message == "") throw new ApiError(404, "All fields are require !!")
//     let conversation = await Conversation.findOne({ patispaents: { $all: [senderId, resiverId] } })
//     if (!conversation) {
//         conversation = await Conversation.create({
//             patispaents: [senderId, resiverId]
//         })
//     }

//     const newMessagge = await Message.create({
//         sender: senderId,
//         receiver: resiverId,
//         message
//     })
//     if (!newMessagge) throw new ApiError(500, "fail to create a message")

//     conversation.messages.push(newMessagge._id)

//     await Promise.all([newMessagge.save(), conversation.save()])

//     // socket implimenting

//     const resiverSocketId = getResiverSocketId(resiverId)
//     // console.log("resiver socket id is : ",resiverSocketId);
//     io.to(resiverSocketId).emit("newMessage", newMessagge)

//     return res
//         .status(202)
//         .json(new ApiResponse(202, { newMessagge, conversation }, "message send successfuly !!"))
// })

// const getmessages = AsyncHandler(async (req, res) => {
//     const resiverId = req.params.id
//     const senderId = req.userId
//     if (!resiverId || !senderId) throw new ApiError(500, "can't find resiverId or senderId")
//     const conversatin = await Conversation.findOne({ patispaents: { $all: [resiverId, senderId] } }).populate("messages")
//     if (!conversatin) throw new ApiError(500, "conversation not found ")
//     return res
//         .status(202)
//         .json(new ApiResponse(202, conversatin.messages, "message get successfully !!"))
// })


const SendTextMessage = AsyncHandler(async (req, res) => {
    const userId = req.userId; // Extract sender ID from JWT
    const { text: content } = req.body; // Message content
    const { id: conversationId } = req.params; // Conversation ID from route params

    if (!userId) throw new ApiError(401, "Unauthorized credentials");
    if (!conversationId) throw new ApiError(400, "Conversation ID is required");
    if (!content || content.trim() === "") throw new ApiError(400, "Message content cannot be empty");

    // Fetch the conversation
    const conversation = await Conversation.findById(conversationId).select("participants");
    if (!conversation) throw new ApiError(404, "Conversation not found");
    // Validate user participation in the conversation
    if (!conversation.participants.some((participant) => participant.equals(userId))) {
        throw new ApiError(403, "You are not a participant of this conversation");
    }

    // Fetch sender and validate
    const sender = await User.findById(userId).select("friendList blockList");
    if (!sender) throw new ApiError(401, "User not found");

    // Determine the receiver(s)
    const receivers = conversation.participants.filter((participant) => !participant.equals(userId));

    if (receivers.length === 0) throw new ApiError(400, "No valid receiver found in the conversation");

    // Validate relationships and blocking logic
    for (const receiverId of receivers) {
        const receiver = await User.findById(receiverId).select("blockList");
        if (!receiver) throw new ApiError(404, "Receiver not found");
        // if (!sender.friendList.includes(receiverId.toString())) {
        //     throw new ApiError(400, `User with username ${receiver.username} is not in your friend list`);
        // }
        if (sender.blockList.includes(receiverId.toString())) {
            throw new ApiError(403, `You have blocked user with ID ${receiverId}`);
        }
        if (receiver.blockList.includes(userId)) {
            // If blocked by the receiver, log the message as "deleted for receiver"
            const newMessage = await Message.create({
                content,
                sender: userId,
                conversation: conversation._id,
                deletedFor: [receiver._id],
            });



            return res
                .status(201)
                .json(
                    new ApiResponse(201, newMessage, "Message sent but not delivered (you are blocked by the receiver)")
                );
        }
    }

    // Create and save the text message
    const newMessage = await Message.create({
        content,
        sender: userId,
        conversation: conversation._id,
    });

    // Update the conversation's last message
    conversation.lastMessage = newMessage._id;
    await conversation.save();

    // console.log('friend id is : ', receivers[0]._id);
    // console.log('user id is : ', userId);

    // socket implementation
    const resiverSocketId = getResiverSocketId(receivers[0]._id)

    console.log("resiver socket id is : ", resiverSocketId);
    io.to(resiverSocketId).emit("newMessage", newMessage)

    return res
        .status(201)
        .json(new ApiResponse(201, newMessage, "Text message sent successfully"));
});

const DeleteTextMessageForMe = AsyncHandler(async (req, res) => {
    const userId = req.userId; // Extract user ID from JWT
    const { id: messageId } = req.params; // Message ID from route params

    if (!userId) throw new ApiError(401, "Unauthorized credentials");
    if (!messageId) throw new ApiError(400, "Message ID is required");

    // Find the message
    const message = await Message.findById(messageId);
    if (!message) throw new ApiError(404, "Message not found");

    // Find the associated conversation
    const conversation = await Conversation.findById(message.conversation);
    if (!conversation || !conversation.participants.some((participant) => participant.equals(userId))) {
        throw new ApiError(403, "You are not part of this conversation");
    }

    // Check if the user has already deleted the message for themselves
    if (message.deletedFor.includes(userId)) {
        return res
            .status(400)
            .json(
                new ApiResponse(400, true, "You have already deleted this message for yourself")
            );
    }

    // Add the user ID to the `deletedFor` list
    message.deletedFor.push(userId);

    // Check if all participants have deleted the message
    const allDeleted = conversation.participants.every((participant) =>
        message.deletedFor.some((deletedUser) => deletedUser.equals(participant))
    );

    if (allDeleted) {
        // Delete the message from the database
        await Message.findByIdAndDelete(messageId);

        return res.status(200).json(
            new ApiResponse(200, true, "Message deleted for all participants")
        );
    }

    // Save the updated message
    await message.save();

    return res.status(200).json(
        new ApiResponse(200, true, "Message successfully deleted for you")
    );
});

const UpdateMessage = AsyncHandler(async (req, res) => {
    const userId = req.userId; // Extract user ID from JWT
    const { id: messageId } = req.params; // Message ID from route params
    const { newContent } = req.body; // New message content from the request body

    if (!userId) throw new ApiError(401, "Unauthorized credentials");
    if (!messageId) throw new ApiError(400, "Message ID is required");
    if (!newContent) throw new ApiError(400, "New content is required");

    // Find the message by ID
    const message = await Message.findById(messageId);
    if (!message) throw new ApiError(404, "Message not found");

    // Ensure the user is the sender of the message
    if (!message.sender.equals(userId)) {
        throw new ApiError(403, "Only the sender can update the message");
    }

    // Check if the message was sent within the last 15 minutes
    const messageTime = message.createdAt; // Time when the message was created
    const currentTime = new Date(); // Current time
    const timeDifference = (currentTime - messageTime) / (1000 * 60); // Difference in minutes

    if (timeDifference > 15) {
        throw new ApiError(403, "You can only update the message within 15 minutes of sending it");
    }

    // Update the message content
    message.content = newContent;

    // Save the updated message to the database
    await message.save();

    // Return a success response
    return res.status(200).json(
        new ApiResponse(200, message, "Message updated successfully")
    );
});

const SendMediaMessage = AsyncHandler(async (req, res) => {
    const userId = req.userId;
    const { id: conversationId } = req.params;
    const { file } = req

    if (!userId) throw new ApiError(401, "Unauthorized credentials");
    if (!conversationId) throw new ApiError(400, "Conversation ID is required");
    if (!file) throw new ApiError(400, "No media files uploaded");

    const isParticipant = await Conversation.exists({ _id: conversationId, participants: userId });
    if (!isParticipant) throw new ApiError(403, "You are not a participant of this conversation");

    const uploadedMedia = [];
    try {
        const uploadResult = await uploadOnCloudinary(file.path)
        if (uploadResult.error) throw new ApiError(500, "Failed to upload media");
        // console.log(uploadResult);
        uploadedMedia.push({
            url: uploadResult.secure_url,
            type: file.mimetype.split("/")[0],
            name: file.originalname,
            size: file.size,
            height: uploadResult.height,
            width: uploadResult.width

        })
    } catch {
        throw new ApiError(500, "Faild to uplod on Cloudinary")
    }

    const newMessage = await Message.create({
        media: uploadedMedia,
        sender: userId,
        conversation: conversationId
    });
    await Conversation.updateOne({
        _id: conversationId
    },
        { lastMessage: newMessage._id });

    return res.status(201).json(new ApiResponse(201, newMessage, "Media message sent successfully"));
});

const DeleteMediaMessageForMe = AsyncHandler(async (req, res) => {
    const userId = req.userId; // Extract user ID from JWT
    const { id: messageId } = req.params; // Message ID from route params

    if (!userId) throw new ApiError(401, "Unauthorized credentials");
    if (!messageId) throw new ApiError(400, "Message ID is required");

    // Find the media message
    const message = await Message.findById(messageId);
    if (!message) throw new ApiError(404, "Message not found");

    // Ensure the message contains media
    if (!message.media || message.media.length === 0) {
        throw new ApiError(400, "This message does not contain any media");
    }

    // Find the associated conversation
    const conversation = await Conversation.findById(message.conversation);
    if (!conversation || !conversation.participants.some((participant) => participant.equals(userId))) {
        throw new ApiError(403, "You are not part of this conversation");
    }

    // Check if the user has already deleted the message for themselves
    if (message.deletedFor.includes(userId)) {
        return res.status(400).json(
            new ApiResponse(400, null, "You have already deleted this message for yourself")
        );
    }

    // Add the user ID to the `deletedFor` list
    message.deletedFor.push(userId);

    // Check if all participants have deleted the message
    const allDeleted = conversation.participants.every((participant) =>
        message.deletedFor.some((deletedUser) => deletedUser.equals(participant))
    );

    if (allDeleted) {
        // Remove the media files from Cloudinary
        try {
            await deleteFromCloudinary(mediaItem.url);
        } catch (error) {
            throw new ApiError(500, "fail to delete file from cloudinary")
        }

        // Delete the message from the database
        await Message.findByIdAndDelete(messageId);

        return res.status(200).json(
            new ApiResponse(200, null, "Media message deleted for all participants")
        );
    }

    // Save the updated message
    await message.save();

    return res.status(200).json(
        new ApiResponse(200, message, "Media message successfully deleted for you")
    );
});

const DeleteMessageForEveryone = AsyncHandler(async (req, res) => {
    const userId = req.userId; // Extract user ID from JWT
    const { id: messageId } = req.params; // Message ID from route params

    if (!userId) throw new ApiError(401, "Unauthorized credentials");
    if (!messageId) throw new ApiError(400, "Message ID is required");

    // Find the message
    const message = await Message.findById(messageId);
    if (!message) throw new ApiError(404, "Message not found");

    // Check if the user is the sender of the message
    if (!message.sender.equals(userId)) {
        throw new ApiError(403, "You can only delete your own messages for everyone");
    }

    message.isDeletedForEveryone = true;
    message.content = "This message has been deleted";
    message.media = [];
    message.code = ""

    await message.save();

    // Inform all participants that the message was deleted
    const conversation = await Conversation.findById(message.conversation);
    if (!conversation) throw new ApiError(404, "Conversation not found");

    // Notify all participants in the conversation (optional, may use sockets or other logic)
    // Emit a notification for message deletion if necessary (using sockets or a service)

    return res.status(200).json(
        new ApiResponse(200, message, "Message successfully deleted for everyone")
    );
});

const DeleteMediaForEveryone = AsyncHandler(async (req, res) => {
    const userId = req.userId; // Extract user ID from JWT
    const { id: messageId } = req.params; // Message ID from route params

    if (!userId) throw new ApiError(401, "Unauthorized credentials");
    if (!messageId) throw new ApiError(400, "Message ID is required");

    // Find the media message
    const message = await Message.findById(messageId);
    if (!message) throw new ApiError(404, "Message not found");

    // Ensure the message contains media
    if (!message.media || message.media.length === 0) {
        throw new ApiError(400, "This message does not contain any media");
    }

    // Check if the user is the sender of the message
    if (!message.sender.equals(userId)) {
        throw new ApiError(403, "Only the sender can delete the message for everyone");
    }

    // Set the `isDeletedForEveryone` field to true
    message.isDeletedForEveryone = true;

    // Remove the media files from Cloudinary
    for (const mediaItem of message.media) {
        await deleteFromCloudinary(mediaItem.url); // Delete from Cloudinary
    }

    // Clear the media content and set the message as deleted for everyone
    message.media = [];
    message.content = ""; // Optionally clear the text content

    // Save the updated message
    await message.save();

    // Find the associated conversation
    const conversation = await Conversation.findById(message.conversation);
    if (!conversation) throw new ApiError(404, "Conversation not found");

    // Update the last message in the conversation (optional)
    if (conversation.lastMessage.equals(messageId)) {
        // You can either update the conversation's last message or set it to null if needed
        conversation.lastMessage = null; // Set to null or a new valid message ID
        await conversation.save();
    }

    return res.status(200).json(
        new ApiResponse(200, null, "Media message deleted for everyone")
    );
});

const sendCode = AsyncHandler(async (req, res) => {
    const userId = req.userId;
    const { id: conversationId } = req.params;
    const { code } = req.body;

    if (!userId) throw new ApiError(401, "Unauthorized credentials");
    if (!conversationId) throw new ApiError(400, "Conversation ID is required");
    const conversation = await Conversation.findById(conversationId)
    if (!conversation) throw new ApiError(400, "invalid conversation id")
    if (!code) throw new ApiError(400, "Code is required");

    if (!conversation.participants.some((participant) => participant.equals(userId))) {
        throw new ApiError(403, "You are not a participant of this conversation");
    }

    const newMessage = await Message.create({
        code,
        sender: userId,
        conversation: conversationId
    });

    return res.status(201).json(new ApiResponse(201, newMessage, "Code message sent successfully"));
});

const GetMessages = AsyncHandler(async (req, res) => {
    const userId = req.userId;

    const user = await User.findById(userId)

    if (!user) throw new ApiError(400, "user not found ")

    const { conversationId } = req.params;

    if (!conversationId) throw new ApiError(400, "Conversation ID is required");

    if (!checkMongoId(conversationId)) throw new ApiError(400, "Invalid Conversation ID");

    const convertedObjectId = ConvertToObjectId(conversationId);

    const messages = await Message.find({
        conversation: conversationId
    })
    if (!messages.length) return res.status(200).json(new ApiResponse(200, [], "Empty messages"));

    const filteredMessages = messages.filter(message => !message.deletedFor.includes(user._id));

    return res.status(200).json(new ApiResponse(200, filteredMessages, "Messages retrieved successfully"));

});

export {
    SendTextMessage,
    DeleteTextMessageForMe,
    UpdateMessage,
    SendMediaMessage,
    DeleteMediaMessageForMe,
    DeleteMessageForEveryone,
    DeleteMediaForEveryone,
    sendCode,
    GetMessages
}