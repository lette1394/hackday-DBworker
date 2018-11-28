import express from "express";
import http from "http";
import io from "socket.io";
var PORT = 5000;
var app = express();
var server = http.createServer(app);
var ioServer = io(server);
// app.use(express.static(__dirname + "/../dist-client"));
server.listen(PORT, function () {
    console.log("Server listening at port %d", PORT);
});
ioServer.on("connection", function (socket) {
    console.log("Socket connected");
    socket.on("message", function (msg) {
        socket.emit("reply", msg + "from server");
    });
});
