export enum PlayerRatingTimePeriod {
  Season = 'season',
  Pr7 = 'pr7',
  Pr15 = 'pr15',
  Pr30 = 'pr30',
}

export interface PlayerRating {
  totalRating: number;
  positionalRanking: number;
}

export type PlayerRatingsMapByTimePeriod = Partial<Record<PlayerRatingTimePeriod, PlayerRating>>;

export interface BaseballPlayer {
  id: string;
  name: string | null;
  img: string | null;
  team: string | null;
  position: string | null;
  playerRatings: PlayerRatingsMapByTimePeriod | null;
}
