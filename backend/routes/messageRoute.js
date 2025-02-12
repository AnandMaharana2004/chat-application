import { Router } from "express";
import {
    SendTextMessage,
    DeleteTextMessageForMe,
    UpdateMessage,
    SendMediaMessage,
    DeleteMediaMessageForMe,
    DeleteMessageForEveryone,
    DeleteMediaForEveryone,
    GetMessages
} from '../controllers/messageController.js';
import { auth_verify } from "../middleware/AuthMiddleware.js";
import upload from "../middleware/Multer.js";

const router = Router();

router.route('/send-text/:id').post(auth_verify, SendTextMessage); //✅
router.route('/delete-message-for-me/:id').put(auth_verify, DeleteTextMessageForMe); //✅
router.route('/update-message/:id').put(auth_verify, UpdateMessage);
router.route('/send-media/:id').post(auth_verify, upload.single("media"), SendMediaMessage); // use upload middleware for file uploading
router.route('/delete-media-for-me/:id').put(auth_verify, DeleteMediaMessageForMe);
router.route('/delete-message-for-everyone/:id').delete(auth_verify, DeleteMessageForEveryone);
router.route('/delte-media-for-everyone/:id').delete(auth_verify, DeleteMediaForEveryone);
router.route('/get-messages/:conversationId').get(auth_verify, GetMessages); //✅

export default router; 