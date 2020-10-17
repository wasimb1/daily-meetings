const   mongoose    =   require("mongoose");
mongoose.connect(process.env.DB_CONN, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
}).then(() =>{
    console.log("Database connected");
}).catch(err =>{
    console.log(err);
    // res.send(err);
});