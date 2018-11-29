export enum NotificationImportance {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  URGENT = "URGENT"
}

export enum UserGrade {
  BRONZE = "BRONZE",
  SILVER = "SILVER",
  GOLD = "GOLD",
  PLATINUM = "PLATINUM"
}

export interface Notification {
  key: string;
  title: string;
  message: string;
  importance: NotificationImportance;
  createAt: Date;
  grade: UserGrade;
}
