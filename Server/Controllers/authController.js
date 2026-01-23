import bcrypt from "bcryptjs";
import userModel from "../Models/user.js";

const registerUser = async (req,res) => {
    try{
        const {name,email,password} = req.body;
        console.log("name : ",name);
        console.log("email : ",email);
        console.log("password : ",password);

        const doc = await userModel.findOne({email:email});

        if(doc){
            return res.send({
                status:0,
                "msg":"user already exist"
            })
        }

        const hashedPassword = await bcrypt.hash(password,10);
        const saved = new userModel({name,email,password:hashedPassword});
        await saved.save();

        return res.send({
            status:1,
            "msg":"user registered !"
        });

    }
    catch(e){
        return res.send({
            status:0,
            "msg":"error faced during registration"
        })
    }
}

export {registerUser};