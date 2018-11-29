import * as express from "express";
import * as http from "http";
import * as mysql from "mysql";
import * as bodyParser from "body-parser";
import { isArray } from "util";
import { User } from "./interface";
import * as cors from "cors";

const PORT: Number = 8999;
const app: express.Express = express();
app.use(cors());
app.use(bodyParser.json());
const server: http.Server = http.createServer(app);

const dbcon = mysql.createConnection({
  host: "dragit-mysql.cknikg5owuyr.ap-northeast-2.rds.amazonaws.com",
  user: "master_dragit",
  password: "passdragitword!",
  charset: "utf8_general_ci",
  database: "hackday"
});

app.post("/login", (req, res) => {
  const reqEmail = req.body.email;
  const QUERY =
    "SELECT nickname, grade FROM user, user_grade WHERE email = ? AND user.user_grade_id = user_grade.id";

  dbcon.query(QUERY, [reqEmail], (err, result: User[]) => {
    if (err) throw err;
    console.log(result);
    if (result) res.status(200).send(result[0]);
  });
});

app.post("/register", (req, res) => {
  const { email, nickname, grade } = req.body;
  console.log(email, nickname, grade);

  const QUERY =
    "INSERT INTO user (email, nickname, user_grade_id) VALUES (?, ?, (SELECT id FROM user_grade WHERE user_grade.grade = ?));";

  dbcon.query(QUERY, [email, nickname, grade], (err, result: User[]) => {
    if (err) {
      console.log(err);
      res.status(400).send();
    }
    console.log(result);
    if (result) res.status(200).send();
  });
});

server.listen(
  PORT,
  (): void => {
    console.log("Server listening at port %d", PORT);
  }
);
