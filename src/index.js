const   express         =   require('express'),
        dotenv          =   require("dotenv").config(),
        ejs             =   require('ejs'),
        bcrypt          =   require('bcrypt'),
        mongoose        =   require("mongoose"),
        methodOverride  =   require("method-override"),
        cookieParser    =   require("cookie-parser"),
        jwt             =   require('jsonwebtoken');
//connect database
require("./DB");
//Routes
const   userRoute               =   require("../routes/user"),
        meetingRoute            =   require("../routes/meeting"),
        {authToken, checkUser}  =   require("../middleware/auth");

const app = express();
// returns updated document after quering
mongoose.set("returnOriginal", false)

//Bodyparser
app.use(express.urlencoded({extended: true}));
app.use(express.json())
//template engine
app.set('view engine', 'ejs');
//cookie parser
app.use(cookieParser());
// set directory for static files
app.use(express.static("public"));
//use method-override
app.use(methodOverride("_method"));
//setuplocal variable
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
})
//route setup
app.get('*', checkUser);
app.use("/user",userRoute);
app.use("/meetings", meetingRoute);
app.get("/", (req, res) => res.redirect("/meetings"));


const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`Server stated at port ${PORT}`));