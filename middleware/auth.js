const   jwt     =   require("jsonwebtoken"),
        User    =   require("../models/user");

//verify token
async function authToken(req, res, next) {
    // if (window.localStorage.length > 0) {
    //     localStorage.getItem(token);
    //   } else {
    //     // No items
    //   }
    const token = req.header("x-auth");
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
}
module.exports = authToken;