const   router              =   require("express").Router(),
        Meeting             =   require("../models/meeting"),
        {authToken}           =   require("../middleware/auth"),
        {meetingValidation} =   require("../middleware/validation");

router.route("")// Get all the meetings
    .get(async (req, res) => {
        try {
            const meetings = await Meeting.find({});
            if(!meetings)
                return res.status(404).send("No meetings found");
            // res.send(meetings);
            res.render("templates/meeting/allMeetings", {meetings});
        } catch (error) {
            res.status(500).send(error.message);   
        }
    })// Create a Meeting
    .post(authToken, async (req, res) => {
        const {error} = meetingValidation(req.body);      
        if (error) 
            return res.status(400).send(error.details[0].message);
        // Create new meeting along with its owner
        const newMeeting = {
            ...req.body,
            owner: req.user._id//owner
        }
        try {
            const meeting = await Meeting.create(newMeeting);
            if(!meeting)
                return res.status(400).send("Error creating a meeting");
            res.send(meeting);
            // res.redirect("/meetings");
        } catch (error) {
            res.status(400).send(error.message);
        }
    });

// Get all the meetings created by the current logged-in user
router.get("/me",authToken, async (req, res) => {
    try {
        const meetings = await Meeting.find({owner: req.user._id});
        if(meetings == "")
            return res.status(404).send("No meetings found");
        res.send(meetings);
    } catch (error) {
        res.status(400).send(error.message);
    }
})

//Show form to create a meeting
router.get("/new",authToken, (req, res) => {
    // res.send("form to create a new meeting");
    res.render("templates/meeting/createMeeting");
})

router.route("/:id")// Show a specific meeting by id
    .get(async (req, res) => {
        try {
            const meeting = await Meeting.findById(req.params.id);
            if(!meeting)
                return res.status(400).send("No meeting found");
            // res.send(meeting);
            res.render("templates/meeting/specificMeeting", {meeting});
        } catch (error) {
            res.status(400).send(error.message);
        }
    })
    // Update a specific meeting
    .patch(authToken, async (req, res) => {
        try {
            let resUpdate = Object.keys(req.body);//details received
            //allowed updates
            const allowedUpdates = ["agenda", "details"];
            //filter recieved details to only allowed updates.
            resUpdate = resUpdate.filter(update => allowedUpdates.includes(update));
            if(resUpdate == "")// If res update details are all incorrect
                return res.status(400).send("Not valid updates")
            
            const updatedMeeting = {};
            resUpdate.forEach(update => updatedMeeting[update] = req.body[update]);
    
            const updateMeeting = await Meeting.findOneAndUpdate(req.params.id/*{_id: req.params.id, owner: req.user._id}*/, {$set: updatedMeeting});
            if(!updateMeeting)
                return res.status(404).send("No meeting found to update");
            res.send(updateMeeting);
        } catch (error) {
            console.log(error)
            res.status(400).send(error.message);
        }

    })
    // Delete a specific meeting based on id
    .delete(authToken, async (req, res) => {
        try {
            if(!await Meeting.findOneAndDelete(req.params.id/*{_id: req.params.id, owner: req.user._id}*/))
                return res.status(400).send("Unable to delete");
            res.send("Deleted successfully");
        } catch (error) {
            console.log(error.message)
            res.status(400).send(error.message);
        }
    });

//Show form to update a specific meeting
router.get("/:id/edit", async (req, res) => {
    try {
        const meeting = await Meeting.findById(req.params.id);
        if(!meeting)
            return res.status(401).send("No meeting");
        res.render("templates/meeting/updateMeeting", {meeting});
    } catch (error) {
        console.log(error.message)
        res.status(400).send(error.message);      
    }
    
})

module.exports = router;