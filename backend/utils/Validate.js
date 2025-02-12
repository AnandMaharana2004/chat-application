import mongoose from "mongoose";
import emailValidater from "validator"
function validateFields(...fields) {
    for (const field of fields) {
        if (!field) {
            return { error: `${field} cannot be empty` };
        }
    }
    return { success: true };
}

function vlaidEmail(email){
    return emailValidater.isEmail(email)
}

function checkMongoId(id){
    const result = mongoose.Types.ObjectId.isValid(id)
    return result
}

function ConvertToObjectId(id){
    if(checkMongoId(id)){
        
        return new mongoose.Types.ObjectId(id)
    }
    return null
}
export default validateFields ;

export {vlaidEmail, checkMongoId, ConvertToObjectId}