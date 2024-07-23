//Imports
const express = require("express");
const server = express();
var cors = require("cors");
const http = require("http").Server(server);
var firebaseAdmin = require("firebase-admin");
const GOOGLE_APPLICATION_CREDENTIALS = JSON.parse(
  process.env.service_account as string
);
const firebase = require("firebase");
const { Server } = require("socket.io");
// const io = new Server(server);

//route imports
const authRoute = require("./routes/Authentication");
const dataRoute = require("./routes/KennelRoutes");
const userRoute = require("./routes/UserRoutes");
const statsRoute = require("./routes/StatsRoute");
const wagerRoute = require("./routes/WagerRoute");

//server setup
server.use(cors());
server.use(express.json());
server.use(
  express.urlencoded({
    extended: true,
  })
);

//port setup
let port = process.env.PORT;
if (port == null || port == "") {
  //port = 4000;
  port = process.env.PORT || 3030;
}

//Firebase Initialization

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(
      GOOGLE_APPLICATION_CREDENTIALS),
  projectId: "micro-pilot-299617",
});

const firebaseConfig = {
  apiKey: "AIzaSyAGvqIwmWekWuTd5EPFX_SE-4Vm-qoow1c",
  authDomain: "uhdominoes.firebaseapp.com",
  projectId: "uhdominoes",
  storageBucket: "uhdominoes.appspot.com",
  messagingSenderId: "142291259394",
  appId: "1:698115257838:android:0ffe8512ff8353d0390aff",
  measurementId: "G-BM3QYPLPZQ",
};

firebase.default.initializeApp(firebaseConfig);

server.listen(port, () => {
  console.log(`Server listening at ${port}`);
});

server.use("/api/auth", authRoute);
server.use("/api/data", dataRoute);
server.use("/api/users", userRoute);
server.use("/api/stats", statsRoute);
server.use("/api/wager", wagerRoute);
server.get("/api", (req, res) => {
  res.sendFile(__dirname + "/views/home.html");
});
