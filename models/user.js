const   mongoose    =   require("mongoose"),
        bcrypt      =   require("bcrypt"),
        jwt         =   require("jsonwebtoken"),
        Meeting     =   require("./meeting");

const userSchema =   new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        minlength:7
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        token:{
            type: String,
            required: true
        }
    }],
    date: {
        type: Date,
        default: Date.now
    }
});

userSchema.virtual("meetings", {
    ref: "Meeting",
    localField: "_id",
    foreignField: "owner"
})

userSchema.pre("save", async function(next) {
    const user = this;
    if (user.isModified('password'))
        user.password = await bcrypt.hash(user.password, 10);
    next();
})

userSchema.statics.verifyCredentials = async function(email, password) {
    // find the user via email and password.
    const user = await this.findOne({ email} );
    if (!user) {
        throw new Error("Email or password incorrect");
    }
    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
        throw new Error("Email or password incorrect");
    }
    return user
}

userSchema.methods.generateAuthToken = async function() {
    const user = this;
    const token = jwt.sign({_id: user._id}, process.env.SECRECT_KEY, {expiresIn: 2 * 24 * 60 * 60 });
    user.tokens.push({token});
    await user.save();
    return token;
}

userSchema.methods.toJSON = function() {
    const user = this.toObject();
    delete user.password
    delete user.tokens
    return user;
}

module.exports = mongoose.model("User", userSchema);