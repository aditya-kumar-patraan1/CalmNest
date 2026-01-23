const userauth = async (req,res) => {
    try{

        const id = req.cookie.get; 

        if(!req.body) req.body = {};
        req.body.userId = id;

        return res.send({
            status:1,
            msg:"user is authenticated"
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