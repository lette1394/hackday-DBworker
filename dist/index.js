"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = express_1.default();
let port = 3000;
app.use("/", express_1.default.static(__dirname + "/../public"));
app.get("/hello", (req, res) => {
    return res.send("Can you hear me?");
});
const server = app.listen(port, () => {
    console.log("Express listening on port", port);
});
//# sourceMappingURL=index.js.map