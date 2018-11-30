import { NotificationImportance } from "./interface/Notification";

export const importanceResolver = new Map();
importanceResolver.set(NotificationImportance.LOW, 100);
importanceResolver.set(NotificationImportance.MEDIUM, 200);
importanceResolver.set(NotificationImportance.HIGH, 300);
importanceResolver.set(NotificationImportance.URGENT, 400);

export const excuteQuery = ({ dbConn, QUERY, params }) =>
  new Promise((resolve, reject) => {
    dbConn.query(QUERY, [...params], (err, result: any[]) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(result);
    });
  });
