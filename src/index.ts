import * as express from "express";
import * as http from "http";
import * as mysql from "mysql";
import * as bodyParser from "body-parser";
import { isArray } from "util";
import { User } from "./interface";
import * as cors from "cors";
import * as redis from "redis";
import { Notification, NotificationImportance } from "./interface/Notification";

const PORT: Number = 8999;
const app: express.Express = express();
app.use(cors());
app.use(bodyParser.json());
const server: http.Server = http.createServer(app);

const sub = redis.createClient({
  host: "localhost",
  port: 6379
});

const NOTIFICATION = "notification";
sub.on("message", (channel, value) => {
  const {
    key,
    title,
    message,
    createAt,
    importance,
    grade
  }: Notification = JSON.parse(value);

  const QUERY = `INSERT INTO notification (title, message, importance, created_at) 
    VALUES (?, ?, ?, ?);`;

  console.log(createAt);

  const importanceResolver = new Map();
  importanceResolver.set(NotificationImportance.LOW, 100);
  importanceResolver.set(NotificationImportance.MEDIUM, 200);
  importanceResolver.set(NotificationImportance.HIGH, 300);
  importanceResolver.set(NotificationImportance.URGENT, 400);

  dbcon.query(
    QUERY,
    [title, message, importanceResolver.get(importance), createAt],
    (err, result) => {
      if (err) throw err;
      const { insertId: notiId } = result;

      const QUERY = `SELECT user.id 
        FROM user, user_grade as ug
        WHERE user_grade_id = ug.id 
          AND grade = ?;`;

      dbcon.query(QUERY, [grade], (err, result) => {
        if (err) throw err;

        let values = [];
        result.forEach(({ id }) => values.push([id, notiId, 100]));

        const QUERY = `INSERT INTO 
          user_notification (user_id, notification_id, notification_status_id)
          VALUES ?;`;

        dbcon.query(QUERY, [values], (err, result: User[]) => {
          if (err) throw err;
        });
      });
    }
  );
});
sub.subscribe(NOTIFICATION);

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
    "SELECT email, nickname, grade FROM user, user_grade WHERE email = ? AND user.user_grade_id = user_grade.id";

  dbcon.query(QUERY, [reqEmail], (err, result: User[]) => {
    if (err) throw err;
    console.log(result);

    if (result.length === 0) {
      res.status(400).send();
      return;
    }
    if (result) {
      res.status(200).send(result[0]);
      return;
    }
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

app.get("/notifications", (req, res) => {
  const { email } = req.query;

  const QUERY = `SELECT noti.id, title, message, type, created_at, status 
      FROM 
        notification as noti, 
		    user, 
        user_notification as un, 
        notification_status as ns, 
        notification_importance as ni
        
      WHERE user.email = ?
        AND ns.id = 100
        AND user.id = un.user_id
        AND noti.id = un.notification_id
        AND un.notification_status_id = ns.id
        AND importance = ni.id;`;

  dbcon.query(QUERY, [email], (err, result: Notification[]) => {
    if (err) {
      console.log(err);
      res.status(400).send();
      return;
    }
    res.status(200).send(result);
  });
});

app.post("/notifications", (req, res) => {
  const { email, notificationId, status } = req.body;
  console.log(req.body);

  const QUERY = `INSERT INTO user_notification (user_id, notification_id, notification_status_id)
    VALUES (
      (SELECT id FROM user WHERE email = ?),
      ?,
      (SELECT id FROM notification_status WHERE status = ?)
  );`;

  dbcon.query(QUERY, [email, notificationId, 200], (err, result: User[]) => {
    if (err) {
      console.log(err);
      res.status(400).send();
    }
    console.log(result);
    if (result) res.status(200).send();
  });
});

app.put("/notifications", (req, res) => {
  console.log(req.body);
  const { id, read } = req.body;

  const QUERY = `UPDATE user_notification
      SET notification_status_id=?
      WHERE notification_id=?`;

  dbcon.query(QUERY, [200, id], (err, result) => {
    if (err) {
      console.log(err);
      res.status(400).send();
    }
    console.log(result);
    res.status(200).send();
  });
});

server.listen(
  PORT,
  (): void => {
    console.log("Server listening at port %d", PORT);
  }
);
