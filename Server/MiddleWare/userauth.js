const userauth = async (req,res,next) => {
    try{

        console.log(req.cookie);

        return res.send({
            status:1,
            msg:"credential matched"
        });

    }
    catch(e){
        return res.send({
            status:0,
            msg:"credential not matched"
        });
    }
    next();
}

export default  userauth;