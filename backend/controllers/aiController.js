import { getAiResponse } from "../config/geminiConfiguration";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import AsyncHandler from "../utils/AsyncHandler";

const analyseCode = AsyncHandler(async (req, res)=>{
    const {prompt} = req.body 
    if(!prompt) throw new ApiError(400, "prompt is require")
    const aiResponse = await  getAiResponse()
    
    return res.status(200).json(new ApiResponse(200,aiResponse,"response itrate successfuly"))
})

export {analyseCode}