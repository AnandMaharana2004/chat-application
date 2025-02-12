import { Conversation } from "../models/conversation.model.js";
import { User } from "../models/usre.model.js"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import AsyncHandler from "../utils/AsyncHandler.js";


const CreateConversationForSingleChat = AsyncHandler(async (req, res) => {
    const userId = req.userId;
    const { id: friendId } = req.params;

    if (!friendId) throw new ApiError(400, "Friend ID is required.");

    // Check if both users exist
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);
    if (!user || !friend) throw new ApiError(404, "User or Friend not found.");

    // Check if a conversation already exists between the two users
    let conversation = await Conversation.findOne({
        patispaents: { $all: [userId, friendId] }
    });

    if (conversation) {
        return res
            .status(200)
            .json(new ApiResponse(200, conversation, "Conversation already exists."));
    }

    // Create a new conversation
    conversation = new Conversation({
        patispaents: [userId, friendId],
        lastMessage: null // Initially, there is no last message
    });

    await conversation.save();

    return res
        .status(201)
        .json(new ApiResponse(201, conversation, "Conversation created successfully."));
});

const CreateConversationForGroupChat = AsyncHandler(async (req, res) => {
    const userId = req.userId;
    const { participantIds } = req.body;

    if (!Array.isArray(participantIds) || participantIds.length < 2) {
        throw new ApiError(400, "At least two participants are required for a group chat.");
    }

    // Ensure the user initiating the group chat is included in the participants
    if (!participantIds.includes(userId)) {
        participantIds.push(userId);
    }

    // Check if all participants exist
    const users = await User.find({ _id: { $in: participantIds } });
    if (users.length !== participantIds.length) {
        throw new ApiError(404, "One or more participants not found.");
    }

    // Create a new conversation for the group chat
    const conversation = new Conversation({
        patispaents: participantIds,
        lastMessage: null // Initially, there is no last message
    });

    await conversation.save();

    return res
        .status(201)
        .json(new ApiResponse(201, conversation, "Group conversation created successfully."));
});

const GetGroupChatConversation = AsyncHandler(async (req, res) => {
    const userId = req.userId;
    const { conversationId } = req.params;

    if (!conversationId) throw new ApiError(400, "Conversation ID is required.");

    // Retrieve the group chat conversation
    const conversation = await Conversation.findById(conversationId)
        .populate('patispaents', 'username profilePicture')
        .populate('lastMessage');

    if (!conversation) throw new ApiError(404, "Conversation not found.");

    // Check if the user is a participant in the conversation
    if (!conversation.patispaents.some(participant => participant._id.toString() === userId.toString())) {
        throw new ApiError(403, "You are not authorized to view this conversation.");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, conversation, "Group chat conversation retrieved successfully."));
});

const GetGroupChatUserList = AsyncHandler(async (req, res) => {
    const userId = req.userId;
    const { conversationId } = req.params;

    if (!conversationId) throw new ApiError(400, "Conversation ID is required.");

    // Retrieve the group chat conversation
    const conversation = await Conversation.findById(conversationId).select("patispaents");
    if (!conversation) throw new ApiError(404, "Conversation not found.");

    // Check if the user is a participant in the conversation
    if (!conversation.patispaents.some(participant => participant.toString() === userId.toString())) {
        throw new ApiError(403, "You are not authorized to view this conversation.");
    }

    try {
        // Use aggregation pipeline to get user list with their profilePicture, about, and username
        const users = await User.aggregate([
            {
                $match: {
                    _id: { $in: conversation.patispaents }
                }
            },
            {
                $project: {
                    username: 1,
                    profilePicture: 1,
                    about: 1
                }
            }
        ]);

        return res
            .status(200)
            .json(new ApiResponse(200, users, "User list retrieved successfully."));
    } catch (error) {
        throw new ApiError(500, "Error while retrieving user list.");
    }
});

export {
    CreateConversationForSingleChat,
    CreateConversationForGroupChat,
    GetGroupChatConversation,
    GetGroupChatUserList
}