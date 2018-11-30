import { User } from "./interface";

import { Notification } from "./interface/Notification";

export const registerRestHandler = ({ app, dbConn }) => {
  app.post("/login", (req, res) => {
    const reqEmail = req.body.email;
    const QUERY =
      "SELECT email, nickname, grade FROM user, user_grade WHERE email = ? AND user.user_grade_id = user_grade.id";

    dbConn.query(QUERY, [reqEmail], (err, result: User[]) => {
      if (err) throw err;

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

    const QUERY =
      "INSERT INTO user (email, nickname, user_grade_id) VALUES (?, ?, (SELECT id FROM user_grade WHERE user_grade.grade = ?));";

    dbConn.query(QUERY, [email, nickname, grade], (err, result: User[]) => {
      if (err) {
        console.error(err);
        res.status(400).send();
      }
      if (result) res.status(200).send();
    });
  });

  app.get("/notifications", (req, res) => {
    const { email } = req.query;

    const QUERY = `SELECT noti.id, title, message, type as importance, created_at, status 
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

    dbConn.query(QUERY, [email], (err, result: Notification[]) => {
      if (err) {
        console.error(err);
        res.status(400).send();
        return;
      }
      res.status(200).send(result);
    });
  });

  app.post("/notifications", (req, res) => {
    const { email, notificationId, status } = req.body;

    const QUERY = `INSERT INTO user_notification (user_id, notification_id, notification_status_id)
    VALUES (
      (SELECT id FROM user WHERE email = ?),
      ?,
      (SELECT id FROM notification_status WHERE status = ?)
  );`;

    dbConn.query(QUERY, [email, notificationId, 200], (err, result: User[]) => {
      if (err) {
        console.error(err);
        res.status(400).send();
      }
      if (result) res.status(200).send();
    });
  });

  app.put("/notifications", (req, res) => {
    const { id, read } = req.body;

    const QUERY = `UPDATE user_notification
      SET notification_status_id=?
      WHERE notification_id=?`;

    dbConn.query(QUERY, [200, id], (err, result) => {
      if (err) {
        console.error(err);
        res.status(400).send();
      }
      res.status(200).send();
    });
  });
};
