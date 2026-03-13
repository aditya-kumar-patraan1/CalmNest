import jwt from "jsonwebtoken";
import userModel from "../Models/user.js";


const getUserData = async (req, res) => {
    try {

        const id = req.userId;

        if (!id) {
            return res.send({
                status: 0,
                "msg": "user does'nt exist"
            })
        }

        const existingUserData = await userModel.findById(id);

        if (!existingUserData) {
            return res.send({
                status: 0,
                "msg": "user does'nt exist"
            })
        }

        return res.send({
            status: 1,
            userData: { name: existingUserData.name, email: existingUserData.email }
        })
    }
    catch (e) {
        return res.send({
            status: 0,
            msg: "error occured"
        })
    }
}

export { getUserData };