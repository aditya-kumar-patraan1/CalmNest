import bcrypt from "bcryptjs";
import userModel from "../Models/user.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config()

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

const loginUser = async (req,res) => {
    try{
        console.log("login user hit !");
        const {email,password} = req.body;

        // console.log(req.body);

        if(!email || !password){
            return res.json({
                "status":0,
                "msg":"please provide email and password"
            });
        }


        // check whether email exist in database
        const existingUser = await userModel.findOne({email:email});
        
        if(!existingUser){
            return res.json({
                status:0,
                msg:"User does'nt registered"
            })
        }

        //now check the password with bcrypted one
        const isSamePassword = await bcrypt.compare(password,existingUser.password);
        
        
        
        //creating the token
        const token = jwt.sign({ id : existingUser.id },process.env.JWT_SECRET,{
            expiresIn : "7d",
        })

        // console.log("token is : ",token);

        res.cookie('calmnestToken',token,{
            httpOnly : true,
            secure : true,
            sameSite : 'None',
            maxAge : 24 * 60 * 60 * 1000
        });


        if(!isSamePassword){
            return res.send({
                status:0,
                msg:"Password is incorrect"
            })
        }

        // console.log("password matched");

        return res.json({
            status:1,
            msg:"Login successful"
        })

    }
    catch(e){
        return res.send({
            status:0,
            msg:"user not login credentials are not correct"
        })
    }
}


const testing = async (req,res) => {
    try{
        console.log(req.cookie);

    }
    catch(e){
        return res.send({
            status : 0,
            msg:`error occured : ${e}`
        })
    }
}

export {registerUser,loginUser,testing};