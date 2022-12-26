require("dotenv").config();
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const AccessToken = require("twilio").jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;
const express = require("express");
const app = express();
const port = 5000;

// use the Express JSON middleware
app.use(express.json());
app.use(cors());

// create the twilioClient
const twilioClient = require("twilio")(
  process.env.TWILIO_API_KEY_SID,
  process.env.TWILIO_API_KEY_SECRET,
  { accountSid: process.env.TWILIO_ACCOUNT_SID }
);

const findOrCreateRoom = async (roomName) => {
  try {
    // see if the room exists already. If it doesn't, this will throw
    // error 20404.
    await twilioClient.video.rooms(roomName).fetch();
  } catch (error) {
    console.log("error", { error });
    try {
      if (error.code == 20404) {
        // the room was not found, so create it
        await twilioClient.video.rooms.create({
          uniqueName: roomName,
          type: "group",
        });
      }
    } catch (error) {
      console.log("error", error);
    }
  }
};

const getAccessToken = (roomName) => {
  // create an access token
  const token = new AccessToken(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_API_KEY_SID,
    process.env.TWILIO_API_KEY_SECRET,
    // generate a random unique identity for this participant
    {
      identity: uuidv4(),
    }
  );
  // create a video grant for this specific room
  const videoGrant = new VideoGrant({
    room: roomName,
  });

  // add the video grant
  token.addGrant(videoGrant);
  // serialize the token and return it
  return token.toJwt();
};

app.post("/join-room", async (req, res) => {
  if (!req.body || !req.body.roomName) {
    return res.status(400).send("Must include roomName argument.");
  }
  const roomName = req.body.roomName;
  findOrCreateRoom(roomName);
  const token = getAccessToken(roomName);
  res.send({
    token: token,
  });
});

// serve static files from the public directory
app.use(express.static("public"));

if (process.env.NODE_ENV == "production") {
  const path = require("path");

  app.get("/", (req, res) => {
    app.use(express.static(path.resolve(__dirname, "client", "build")));
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

// Start the Express server
app.listen(port, () => {
  console.log(`Express server is running on port ${port}`);
});
