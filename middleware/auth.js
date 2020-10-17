const   jwt     =   require("jsonwebtoken"),
        User    =   require("../models/user");

//verify token
async function authToken(req, res, next) {
    console.log("### " + req.header("Authorization"));
    if ( req.header("Authorization") == 'undefined') {
        const token = req.header("Authorization").replace("Bearer ", "");
        if(!token)
            return res.status(401).send("Not authorised to access");
        
        try {
            const data = jwt.verify(token, process.env.SECRECT_KEY);
            const user = await User.findOne({_id: data._id, 'tokens.token': token});
            if(!user)
                throw new Error();
            req.user = user;
            req.token = token;
            next();
        } catch (error) {
            res.status(401).send({ error: 'Not authorized to access this resource' })
        }
    } else {
        res.send("Need to login");
    }
   
}
module.exports = authToken;