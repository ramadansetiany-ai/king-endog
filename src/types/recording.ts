export interface FarmSettings {
  farmName: string;
  coopName: string;
  initialPop: number;
  targetHd: number;
  period: string;
  eggPrice: number;
  feedPrice: number;
}

export interface DailyRecord {
  date: string;
  dead: number;
  cull: number;
  feed: number;
  good: number;
  cracked: number;
  weight: number;
  notes: string;
}
