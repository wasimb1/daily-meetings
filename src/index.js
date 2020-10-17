const   express         =   require('express'),
        dotenv          =   require("dotenv").config(),
        ejs             =   require('ejs'),
        bcrypt          =   require('bcrypt'),
        mongoose        =   require("mongoose"),
        methodOverride          =   require("method-override"),
        jwt             =   require('jsonwebtoken');
//connect database
require("./DB");
//Routes
const   userRoute       =   require("../routes/user"),
        meetingRoute    =   require("../routes/meeting"),
        User            =   require("../models/user");

const app = express();
// returns updated document after quering
mongoose.set("returnOriginal", false)

//Bodyparser
app.use(express.urlencoded({extended: true}));
app.use(express.json())
//template engine
app.set('view engine', 'ejs');
// set directory for static files
app.use(express.static("public"));
//use method-override
app.use(methodOverride("_method"));
//user and meeting routes
//route setup
app.use("/user",userRoute);
app.use("/meetings", meetingRoute);
app.get("/", (req, res) => res.redirect("/meetings"));

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
})

const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`Server stated at port ${PORT}`));