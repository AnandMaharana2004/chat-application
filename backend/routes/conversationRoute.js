import { Router } from 'express';
import { auth_verify } from '../middleware/AuthMiddleware.js';
import {
    CreateConversationForSingleChat,
    CreateConversationForGroupChat,
    GetGroupChatConversation,
    GetGroupChatUserList
} from '../controllers/conversationController.js';

const router = Router();

router.route('/createconversation/:id').post(auth_verify, CreateConversationForSingleChat);
router.route('/creategroupconversation').post(auth_verify, CreateConversationForGroupChat); // now keep it side 
router.route('/getgroupconversation/:conversationId').get(auth_verify, GetGroupChatConversation);
router.route('/getgroupchatuserlist/:conversationId').get(auth_verify, GetGroupChatUserList);

export default router;