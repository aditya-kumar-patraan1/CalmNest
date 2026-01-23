import mongoose, { model } from 'mongoose';

const user = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true });

const userModel=mongoose.model("calmNest_user",user);
export default userModel;