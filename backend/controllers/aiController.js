import { getAiResponse } from "../config/geminiConfiguration.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import AsyncHandler from "../utils/AsyncHandler.js";

const analyseCode = AsyncHandler(async (req, res) => {
    const { prompt } = req.body

    if (!prompt) throw new ApiError(400, "prompt is require")
    const aiResponse  = await getAiResponse(prompt)
    // return res.status(200).json(new ApiResponse(200, aiResponse, "response itrate successfuly"))
    return res.send(aiResponse)
})



export { analyseCode }