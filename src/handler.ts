import { Notification } from "./interface/Notification";
import { importanceResolver, excuteQuery } from "./helper";

const redisMessageHandler = ({ dbConn }) => (channel, value) => {
  const {
    id: notification_id,
    title,
    message,
    createAt,
    importance,
    grade
  }: Notification = JSON.parse(value);

  const saveNotification = () =>
    new Promise((resolve, reject) => {
      const QUERY = `INSERT INTO 
        notification (id, title, message, importance, created_at) 
        VALUES (?, ?, ?, ?, ?);`;

      excuteQuery({
        dbConn,
        QUERY,
        params: [
          notification_id,
          title,
          message,
          importanceResolver.get(importance),
          createAt
        ]
      })
        .then(() => resolve())
        .catch(() => reject());
    });

  const getUserIdListFromGrade = () =>
    new Promise((resolve, reject) => {
      const QUERY = `SELECT user.id as user_id
            FROM user, user_grade as ug
            WHERE user_grade_id = ug.id 
              AND grade = ?;`;

      excuteQuery({ dbConn, QUERY, params: [grade] })
        .then((result) => resolve(result))
        .catch(() => reject());
    });

  const saveNotificationToAllUserInGrade = (userIdList: any[]) =>
    new Promise((resolve, reject) => {
      const values = userIdList.map(({ user_id }) => [
        user_id,
        notification_id,
        100
      ]);

      const QUERY = `INSERT INTO 
              user_notification (user_id, notification_id, notification_status_id)
              VALUES ?;`;

      excuteQuery({
        dbConn,
        QUERY,
        params: [values]
      })
        .then(() => resolve())
        .catch(() => reject());
    });

  Promise.resolve()
    .then(() => saveNotification())
    .then(() => getUserIdListFromGrade())
    .then((userList: any[]) => saveNotificationToAllUserInGrade(userList));
};

export const handler = {
  redisMessageHandler
};
