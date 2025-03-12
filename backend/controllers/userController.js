import AsyncHandler from '../utils/AsyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { User } from '../models/usre.model.js'
import { uploadOnCloudinary, deleteFromCloudinary, CheckFromCloudinary } from '../utils/Cloudinary.js'
import { checkMongoId, ConvertToObjectId } from '../utils/Validate.js'
import fs from 'fs'
import { Conversation } from '../models/conversation.model.js'



const GetOtherUsers = AsyncHandler(async (req, res) => {
    // Get the ID of the logged-in user from the request object
    const logedInUserId = req.userId;

    // Find all users except the logged-in user and exclude the password field from the result
    const otherUsers = await User.find({ _id: { $ne: logedInUserId } }).select("username profilePicture");

    // Check if no other users were found (empty array)
    if (otherUsers.length === 0) {
        return res
            .status(200) // Use 200 OK status code for successful request with no data
            .json(new ApiResponse(200, [], "No other users found."));
    }

    // Return the list of other users with a success status code and message
    return res
        .status(200) // Use 200 OK status code for successful request with data
        .json(new ApiResponse(200, otherUsers, "Users retrieved successfully."));
    // Handle any errors that occur during the database query
});

const UpdateProfilePic = AsyncHandler(async (req, res) => {
    const userId = req.userId;
    const newProfilePicPath = req?.file?.path;
    console.log(req.file);

    if (!newProfilePicPath) throw new ApiError(400, "Profile picture is required.");

    const user = await User.findById(userId).select("profilePicture");
    if (!user) throw new ApiError(404, "User not found.");

    const previousProfilePicUrl = user.profilePicture;

    if (CheckFromCloudinary(previousProfilePicUrl)) {

        const cloudinaryDeleteResult = await deleteFromCloudinary(previousProfilePicUrl);
        if (cloudinaryDeleteResult.result !== "ok") {
            fs.unlinkSync(newProfilePicPath);
            throw new ApiError(500, "Something went wrong while deleting the previous profile picture.");
        }
    }

    const uploadOnCloudinaryResult = await uploadOnCloudinary(newProfilePicPath);
    user.profilePicture = uploadOnCloudinaryResult.secure_url;

    await user.save();

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Profile picture updated successfully."));
});

const UpdateBio = AsyncHandler(async (req, res) => {
    const userId = req.userId;
    const { bio } = req.body;

    if (!bio) throw new ApiError(400, "Bio is required.");

    const user = await User.findById(userId).select("bio");
    if (!user) throw new ApiError(404, "User not found.");

    user.bio = bio;

    await user.save();

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Bio updated successfully."));
});

const UpdateAbout = AsyncHandler(async (req, res) => {
    const userId = req.userId;
    const { about } = req.body;

    if (!about) throw new ApiError(400, "about is required.");

    const user = await User.findById(userId).select("about");
    if (!user) throw new ApiError(404, "User not found.");

    user.about = about;

    await user.save();

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Bio updated successfully."));
})

const AddToFavorateList = AsyncHandler(async (req, res) => {
    const userId = req.userId;
    const { id: friendId } = req.params || req.headers;

    if (!friendId) throw new ApiError(400, "Friend ID is required.");

    const user = await User.findById(userId).select("favoriteList blockList friendList");
    if (!user) throw new ApiError(404, "User not found.");
    // is avalable in frinedList
    if (!user.friendList.includes(friendId)) {
        throw new ApiError(400, "Friend is not in the friend list.");
    }

    // Remove from block list if present
    if (user.blockList.includes(friendId)) {
        user.blockList = user.blockList.filter(blockedId => blockedId?.toString() !== friendId?.toString());
    }

    // Check if already in favorite list
    if (user.favoriteList.includes(friendId)) {
        throw new ApiError(400, "Friend is already in the favorite list.");
    }

    // Add to favorite list
    user.favoriteList.push(friendId);

    await user.save();

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Friend added to favorite list successfully."));
});

const RemoveFromFavorate = AsyncHandler(async (req, res) => {
    const userId = req.userId;
    const { id: friendId } = req.params || req.headers;

    if (!friendId) throw new ApiError(400, "Friend ID is required.");

    const user = await User.findById(userId).select("favoriteList friendList");
    if (!user) throw new ApiError(404, "User not found.");

    // is avalable in friendList
    if (!user.friendList.includes(friendId)) {
        throw new ApiError(400, "Friend is not in the friend list.");
    }

    if (!user.favoriteList.includes(friendId)) {
        throw new ApiError(400, "Friend is not in the favorite list.");
    }

    user.favoriteList = user.favoriteList.filter(favId => favId.toString() !== friendId.toString());

    await user.save();

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Friend removed from favorite list successfully."));
});

const AddToBlockList = AsyncHandler(async (req, res) => {
    const userId = req.userId;
    const { id: friendId } = req.params || req.headers;

    if (!friendId) throw new ApiError(400, "Friend ID is required.");

    const user = await User.findById(userId).select(" friendList favoriteList blockList");
    if (!user) throw new ApiError(404, "User not found.");

    // is avalable in frinedList
    if (!user.friendList.includes(friendId)) {
        throw new ApiError(400, "Friend is not in the friend list.");
    }

    // Remove from favorite list if present
    if (user.favoriteList.includes(friendId)) {
        user.favoriteList = user.favoriteList.filter(favId => favId.toString() !== friendId.toString());
    }

    // Check if already in block list
    if (user.blockList.includes(friendId)) {
        throw new ApiError(400, "Friend is already in the block list.");
    }

    // Add to block list
    user.blockList.push(friendId);

    await user.save();

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Friend added to block list successfully."));
});

const RemoveFromBlockList = AsyncHandler(async (req, res) => {
    const userId = req.userId;
    const { id: friendId } = req.params || req.headers

    if (!friendId) throw new ApiError(400, "Friend ID is required.");

    const user = await User.findById(userId).select("friendList blockList");
    if (!user) throw new ApiError(404, "User not found.");

    // is avalable in frinedList
    if (!user.friendList.includes(friendId)) {
        throw new ApiError(400, "Friend is not in the friend list.");
    }

    if (!user.blockList.includes(friendId)) {
        throw new ApiError(400, "Friend is not in the block list.");
    }

    user.blockList = user.blockList.filter(blockedId => blockedId.toString() !== friendId.toString());

    await user.save();

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Friend removed from block list successfully."));
});

const AddToFriendList = AsyncHandler(async (req, res) => {
    const userId = req.userId;
    const { id: friendId } = req.params || req.headers;

    if (!friendId) throw new ApiError(400, "Friend ID is required.");

    // Validate if friendId is a valid ObjectId
    if (!checkMongoId(friendId)) {
        throw new ApiError(400, "Invalid Friend ID.");
    }

    if (userId === friendId) {
        throw new ApiError(400, "You cannot add yourself as a friend.");
    }

    // Fetch the user along with friend list & block list
    const user = await User.findById(userId).select("friendList blockList");
    if (!user) throw new ApiError(404, "User not found.");

    // Check if friend is already added
    if (user.friendList.includes(friendId)) {
        throw new ApiError(400, "Friend is already in the friend list.");
    }

    // Check if the user has blocked this friend or vice versa
    const friend = await User.findById(friendId).select("blockList");
    if (!friend) throw new ApiError(404, "Friend user not found.");

    if (user.blockList.includes(friendId)) {
        throw new ApiError(403, "You have blocked this user.");
    }
    if (friend.blockList.includes(userId)) {
        throw new ApiError(403, "This user has blocked you.");
    }

    // Check if conversation already exists
    let conversation = await Conversation.findOne({
        participants: { $all: [userId, friendId] }
    });

    // If not, create a new conversation
    if (!conversation) {
        conversation = await Conversation.create({
            participants: [userId, friendId]
        });

        if (!conversation) throw new ApiError(500, "Failed to create conversation.");
    }

    // Add friend to friend list
    user.friendList.push(friend._id);
    await user.save();

    return res
        .status(200)
        .json(new ApiResponse(200, { friendId, conversationId: conversation._id }, "Friend added successfully."));
});

const RemoveFromFriendList = AsyncHandler(async (req, res) => {
    const userId = req.userId;
    const { id: friendId } = req.params || req.headers;

    if (!friendId) throw new ApiError(400, "Friend ID is required.");

    const user = await User.findById(userId).select("friendList blockList favoriteList");
    if (!user) throw new ApiError(404, "User not found.");

    if (!user.friendList.includes(friendId)) {
        throw new ApiError(400, "Friend is not in the friend list.");
    }

    user.friendList = user.friendList.filter(favId => favId.toString() !== friendId.toString());

    await user.save();

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Friend removed from friend list successfully."));
});

const GetFriendList = AsyncHandler(async (req, res) => {
    const userId = req.userId;

    // Retrieve user's friend list
    const user = await User.findById(userId).select("friendList");
    if (!user) throw new ApiError(404, "User not found.");

    const friendList = user.friendList || [];
    if (!Array.isArray(friendList) || friendList.length === 0) {
        return res.status(200).json(new ApiResponse(200, [], "No friends found in the friend list."));
    }

    // Find conversations involving the user and extract friend IDs
    const conversations = await Conversation.find({
        participants: userId
    }).select("participants lastMessage");

    const friendIdsAndMessages = conversations.reduce((acc, conversation) => {
        conversation.participants.forEach(participant => {
            if (participant.toString() !== userId.toString()) {
                acc.push({
                    friendId: participant.toString(),
                    lastMessage: conversation.lastMessage,
                    conversationId: conversation._id
                });
            }
        });
        return acc;
    }, []);

    // Find friends' details
    const friends = await User.find({
        _id: { $in: friendIdsAndMessages.map(friend => friend.friendId) }
    }).select("profilePicture username");

    // Map friends' details with last message and conversation ID
    const friendsWithMessages = friends.map(friend => {
        const friendInfo = friendIdsAndMessages.find(f => f.friendId === friend._id.toString());
        return {
            _id: friend._id,
            profilePicture: friend.profilePicture,
            username: friend.username,
            lastMessage: friendInfo ? friendInfo.lastMessage : null,
            conversationId: friendInfo ? friendInfo.conversationId : null,
        };
    });

    return res.status(200).json(new ApiResponse(200, friendsWithMessages, "Friend conversations retrieved successfully."));
});

const GetBlockList = AsyncHandler(async (req, res) => {
    const userId = req.userId;

    // Retrieve user's block list
    const user = await User.findById(userId).select("blockList");
    if (!user) throw new ApiError(404, "User not found.");

    const blockList = user.blockList || []; // Ensure blockList is defined

    if (!Array.isArray(blockList) || blockList.length === 0) {
        return res
            .status(200)
            .json(new ApiResponse(200, [], "No users found in the block list."));
    }

    try {
        // Fetch blocked users' details
        const blockedUsers = await User.aggregate([
            {
                $match: {
                    _id: { $in: blockList }
                }
            },
            {
                $project: {
                    username: 1,
                    profilePicture: 1
                }
            }
        ]);

        return res
            .status(200)
            .json(new ApiResponse(200, blockedUsers, "Block list retrieved successfully."));
    } catch (error) {
        throw new ApiError(500, "Error while retrieving block list.");
    }
});

const GetFavorateList = AsyncHandler(async (req, res) => {
    const userId = req.userId;

    // Retrieve user's favorite list
    const user = await User.findById(userId).select("favoriteList");
    if (!user) throw new ApiError(404, "User not found.");

    const favoriteList = user.favoriteList || []; // Ensure favoriteList is defined

    if (!Array.isArray(favoriteList) || favoriteList.length === 0) {
        return res
            .status(200)
            .json(new ApiResponse(200, [], "No users found in the favorite list."));
    }

    try {
        // Fetch favorite users' details
        const favoriteUsers = await User.aggregate([
            {
                $match: {
                    _id: { $in: favoriteList }
                }
            },
            {
                $project: {
                    username: 1,
                    profilePicture: 1
                }
            }
        ]);

        return res
            .status(200)
            .json(new ApiResponse(200, favoriteUsers, "Favorite list retrieved successfully."));
    } catch (error) {
        throw new ApiError(500, "Error while retrieving favorite list.");
    }
});

const GetProfile = AsyncHandler(async (req, res) => {
    const userId = req.userId;
    const id = req.params || req.headers;
    if (id == "") throw new ApiError(404, "id is require")
    if (!checkMongoId(id)) throw new ApiError(404, "invalid id")
        const profileHolderId = ConvertToObjectId(id)
    if (userId == profileHolderId) {
        const user = await User.findById(userId).select(
            "username email gender profilePicture about bio lastSeen isVerified role friendList blockList favoriteList"
        );
        if (!user) throw new ApiError(404, "User not found.")

        const userProfile = {
            id : user._id,
            username: user.username,
            email: user.email,
            gender: user.gender,
            profilePicture: user.profilePicture,
            about: user.about || null,
            bio: user.bio || null,
            lastSeen: user.lastSeen || null,
            isVerified: user.isVerified,
            role: user.role,
            friendCount: user.friendList?.length || 0,
            blockCount: user.blockList?.length || 0,
            favoriteCount: user.favoriteList?.length || 0,
        };

        return res
            .status(200)
            .json(new ApiResponse(200, userProfile, "Profile retrieved successfully."));
    }
    // Retrieve user's profile with selected fields

    const user = await User.findById(profileHolderId).select(
        "username gender profilePicture about bio lastSeen"
    );
    if (!user) throw new ApiError(404, "User not found !!")
    const userProfile = {
        id : user._id,
        username: user.username,
        email: user.email,
        gender: user.gender,
        profilePicture: user.profilePicture,
        about: user.about || null,
        bio: user.bio || null,
        lastSeen: user.lastSeen || null,
    };

    return res
        .status(200)
        .json(new ApiResponse(200, userProfile, "Profile retrieved successfully."));

    // Prepare the response data

});

export {
    GetOtherUsers,
    UpdateProfilePic,
    UpdateBio,
    UpdateAbout,
    AddToFavorateList,
    RemoveFromFavorate,
    AddToBlockList,
    RemoveFromBlockList,
    AddToFriendList,
    RemoveFromFriendList,
    GetFriendList,
    GetBlockList,
    GetFavorateList,
    GetProfile
}