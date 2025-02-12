import { Router } from "express";
import {
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
} from "../controllers/userController.js";
import { auth_verify } from "../middleware/AuthMiddleware.js";
import upload from "../middleware/Multer.js"

const router = Router();

router.route("/getotherusers").get(auth_verify, GetOtherUsers);
router.route("/update-profile-pic").post(auth_verify, upload.single("profilepicture"), UpdateProfilePic);
router.route("/update-bio").put(auth_verify, UpdateBio);
router.route("/update-about").put(auth_verify, UpdateAbout);
router.route("/add-to-favorate/:id").put(auth_verify, AddToFavorateList);
router.route("/remove-from-favorate/:id").put(auth_verify, RemoveFromFavorate);
router.route("/add-to-block/:id").put(auth_verify, AddToBlockList);
router.route("/remove-from-block/:id").put(auth_verify, RemoveFromBlockList);
router.route("/add-to-friend/:id").put(auth_verify, AddToFriendList);
router.route("/remove-from-friend/:id").put(auth_verify, RemoveFromFriendList);
router.route("/friend-list").get(auth_verify, GetFriendList);
router.route("/block-list").get(auth_verify, GetBlockList);
router.route("/favorate-list").get(auth_verify, GetFavorateList);
router.route("/profile/:id").get(auth_verify, GetProfile);

export default router;