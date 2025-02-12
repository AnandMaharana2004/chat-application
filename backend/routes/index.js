import authRoutes from "./authRoute.js";
import userROute from "./userRoute.js";
import messageROute from "./messageRoute.js";
import ConversationRoute from "./conversationRoute.js";

const route = (app) => {
    app.use("/Chat-app/api/v1/auth/", authRoutes);
    app.use("/Chat-app/api/v1/user/", userROute);
    app.use("/Chat-app/api/v1/message/", messageROute);
    app.use("/Chat-app/api/v1/conversation/", ConversationRoute);
}

export default route