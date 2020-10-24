const   router                              =   require("express").Router(),
        User                                =   require("../models/user"),
        {signinValidation, loginValidation} =   require("../middleware/validation"),
        {authToken}                         =   require("../middleware/auth");

router.route("/register")// Register form
    .get((req, res) => {
        res.render("templates/user/register");
    })
    // Process the registered user's detiails
    .post(async (req, res) => {
        const error_msg = [];
        const {error} = signinValidation(req.body);
        if (error) {
            error_msg.push({
                msg: error.details[0].message
            })
            return res.render("templates/user/register", {error_msg});
        }   

        try {
            const foundUser = await User.findOne({email: req.body.email});
            if (foundUser) {
                error_msg.push({
                    msg: "An account with this email already exists"
                })
                return res.render("templates/user/register", {error_msg});
            }
            const user = await User.create(req.body);
            const token = await user.generateAuthToken();
            res.cookie("x-auth", token, { httpOnly: true, maxAge: 2 * 24 * 60 * 60 * 1000 });
            // res.status(201).send({user, token});
            res.redirect("/");
        } catch (error) {
            console.log(error.message)
            res.status(400).send(error.message);
        }

    });
// Login form
router.route("/login")
    .get((req, res) => {
        res.render("templates/user/login")
    })
    // Login Process
    .post(async (req, res) => {
        const error_msg = [];
        //Validation check
        const {error} = loginValidation(req.body);
        if (error) {
            error_msg.push({
                msg: error.details[0].message
            })
            return res.render("templates/user/login", {error_msg});
        }
        
        try {
            const verifiedUser = await User.verifyCredentials(req.body.email, req.body.password);
            
            const token = await verifiedUser.generateAuthToken();
            res.cookie("x-auth", token, { httpOnly: true, maxAge: 2 * 24 * 60 * 60 * 1000 });
            res.redirect("/");
        } catch (error) {
            console.log(error)
            error_msg.push({
                msg: error.message
            });
            return res.render("templates/user/login", {error_msg});
        }
    });

//Own profile
router.get('/me', authToken, async(req, res) => {
    res.send(req.user);
});

//logout
router.get("/logout",authToken, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(singleToken => {
            return singleToken.token != req.token;
        });
        await req.user.save();
        res.cookie('x-auth', '', {maxAge: 1});
        res.redirect("/");
    } catch (error) {
        res.status(500).send(error.message);
    }
})

//logout all
router.get("/logoutall",authToken, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send(req.user);
    } catch (error) {
        res.status(500).send(error.message);
    }
})

module.exports = router;