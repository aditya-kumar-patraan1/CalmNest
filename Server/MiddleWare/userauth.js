import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const userauth = async (req,res,next) => {
    try{

        const {calmnestToken}  = req.cookies;

        if (!calmnestToken) {
            return res.status(401).send({
                status: 0,
                msg: "No token provided"
            });
        }

        //decoding the token
        const payload = jwt.verify(calmnestToken,process.env.JWT_SECRET);
        req.userId = payload.id; 
        next();
    }
    catch(e){
        return res.send({
            status: 0,
            msg: "credential not matched"
        });
    }
}

export {userauth};