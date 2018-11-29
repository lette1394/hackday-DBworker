export enum UserGrade {
  BRONZE = "BRONZE",
  SILVER = "SILVER",
  GOLD = "GOLD",
  PLATINUM = "PLATINUM"
}

export interface User {
  nickname: string;
  grade: UserGrade;
}
