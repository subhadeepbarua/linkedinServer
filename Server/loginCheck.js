const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 5001;
const cors = require('cors');
app.use(cors());
app.use(bodyParser.json());


const loginRoute = require("./routes/login");
const signUpRoute = require("./routes/signup");
const otpGenRoute = require("./routes/otpGenerate")
const verifyOtpRoute = require("./routes/otpVerify")
const timelineRoute = require("./routes/timeline")
const sharePostRoute = require("./routes/sharePost")
const profilRoute = require("./routes/profile")
const profilePicRoute = require("./routes/profilePicUpload")
const userProfilesRoute = require("./routes/userProfiles")
const searchRoute = require("./routes/search")
const handleConnections = require("./routes/connectionAccept")
const connectionsListRoute = require("./routes/connections")
const connectionCancelRoute = require("./routes/connectionCancel");
const connectionSendRoute = require("./routes/connectionSend");
const userProfileUpdateRoute = require("./routes/userProfileUpdate")

app.use("/login",loginRoute)
app.use("/save-user-data",signUpRoute)
app.use("/send-email",otpGenRoute )
app.use("/verify-otp",verifyOtpRoute)
app.use("/search",searchRoute)
app.use("/api/post_datas", timelineRoute)
app.use("/uploadPost", sharePostRoute)
app.use("/uploadProfilePic", profilePicRoute)
app.use('/acceptConnections',handleConnections)
app.use("/api/profile_datas", profilRoute)
app.use("/api/user_profiles", userProfilesRoute)
app.use('/connectionList', connectionsListRoute)
app.use('/connectionCancel', connectionCancelRoute)
app.use('/sendRequest', connectionSendRoute)
app.use('/userDataUpdate', userProfileUpdateRoute)

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
