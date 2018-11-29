import * as express from "express";
import * as http from "http";
import * as mysql from "mysql";
import * as bodyParser from "body-parser";
import { isArray } from "util";
import { User } from "./interface";

const PORT: Number = 8999;
const app: express.Express = express();
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

server.listen(
  PORT,
  (): void => {
    console.log("Server listening at port %d", PORT);
  }
);
