import { User } from "./interface";

import { Notification } from "./interface/Notification";
import { excuteQuery } from "./helper";

export const registerRestHandler = ({ app, dbConn }) => {
  app.post("/login", (req, res) => {
    const { email } = req.body;
    const QUERY = `SELECT email, nickname, grade FROM user, user_grade 
          WHERE email = ? 
          AND user.user_grade_id = user_grade.id`;

    excuteQuery({ dbConn, QUERY, params: [email] })
      .then((result: any[]) => {
        if (result.length === 0) {
          res.status(400).send();
          return;
        }

        res.status(200).send(result[0]);
      })
      .catch(() => res.status(500).send());
  });

  app.post("/register", (req, res) => {
    const { email, nickname, grade } = req.body;

    const QUERY = `INSERT INTO user (email, nickname, user_grade_id) 
        VALUES (
          ?, 
          ?, 
          (SELECT id FROM user_grade WHERE user_grade.grade = ?)
        );`;

    excuteQuery({ dbConn, QUERY, params: [email, nickname, grade] })
      .then(() => res.status(200).send())
      .catch(() => res.status(500).send());
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

    excuteQuery({ dbConn, QUERY, params: [email] })
      .then((result) => res.status(200).send(result))
      .catch(() => res.status(400).send());
  });

  app.post("/notifications", (req, res) => {
    const { email, notificationId, status } = req.body;

    const QUERY = `INSERT INTO 
      user_notification (user_id, notification_id, notification_status_id)
        VALUES (
          (SELECT id FROM user WHERE email = ?),
          ?,
          (SELECT id FROM notification_status WHERE status = ?)
        );`;

    excuteQuery({ dbConn, QUERY, params: [email, notificationId, 200] })
      .then(() => res.status(200).send())
      .catch(() => res.status(400).send());
  });

  app.put("/notifications", (req, res) => {
    const { id, read } = req.body;

    const QUERY = `UPDATE user_notification
      SET notification_status_id=?
      WHERE notification_id=?`;

    excuteQuery({ dbConn, QUERY, params: [200, id] })
      .then(() => res.status(200).send())
      .catch(() => res.status(400).send());
  });
};
