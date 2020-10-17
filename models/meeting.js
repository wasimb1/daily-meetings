const { required } = require("@hapi/joi");
const   mongoose        =   require("mongoose");
const User = require("./user");

const meetingSchema = new mongoose.Schema({
    agenda: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        uppercase: true
    },
    details: {
        type: String,
        required: true,
        trim: true,
        minlength: 10
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
});

module.exports = mongoose.model("Meeting", meetingSchema);