const authToken = require("../middleware/auth");

const   router  =   require("express").Router(),
        User    =   require("../models/user"),
        {signinValidation, loginValidation} = require("../middleware/validation");

router.route("/signin")
    .get((req, res) => {
        console.log("signin route get");
        res.send("get users ")
    })
    .post(async (req, res) => {
        const {error} = signinValidation(req.body);      
        if (error) return res.status(400).send(error.details[0].message);

        try {
            const foundUser = await User.findOne({email: req.body.email});
            if (foundUser)
                return res.status(400).send("An account with this email already exists")
            
            const user = await User.create(req.body);
            const token = await user.generateAuthToken();
            res.header('Authorization', 'Bearer ' + token).send({user, token});
        } catch (error) {
            console.log(error.message)
            res.status(400).send(error.message);
        }

    });
router.route("/login")
    .get((req, res) => {
        res.render("templates/user/login");
    })
    .post(async (req, res) => {
        try {
            const verifiedUser = await User.verifyCredentials(req.body.email, req.body.password);
            if (!verifiedUser)
                return res.status(404).send("Login credentials incorrect. please check your email and password agiain");
            const token = await verifiedUser.generateAuthToken();
            res.header('Authorization', 'Bearer ' + token).send({verifiedUser, token});
            
        } catch (error) {
            console.log(error.message)
            res.status(400).send(error.message);
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
        res.send(req.user);
    } catch (error) {
        res.status(500).send(error.message);
    }
})

//logout all
router.get("/logoutall",authToken, async (req, res) => {
    try {
        const length = req.user.tokens.length;
        req.user.tokens = [];
        await req.user.save();
        res.send(req.user);
    } catch (error) {
        res.status(500).send(error.message);
    }
})

module.exports = router;