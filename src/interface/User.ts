export enum UserGrade {
  BRONZE = "BRONZE",
  SILVER = "SILVER",
  GOLD = "GOLD",
  PLATINUM = "PLATINUM"
}

export interface User {
  email: string;
  nickname: string;
  grade: UserGrade;
}
