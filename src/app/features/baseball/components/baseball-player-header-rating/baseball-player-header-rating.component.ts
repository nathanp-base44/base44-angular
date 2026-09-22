import { Component, Input } from '@angular/core';
import {
  PlayerRating,
  PlayerRatingTimePeriod,
  PlayerRatingsMapByTimePeriod,
} from '../../models/baseball-player.model';

interface RatingRow {
  label: string;
  rating: PlayerRating | null;
}

@Component({
  selector: 'app-baseball-player-header-rating',
  standalone: true,
  templateUrl: './baseball-player-header-rating.component.html',
})
export class BaseballPlayerHeaderRatingComponent {
  @Input() playerRatings: PlayerRatingsMapByTimePeriod | null = null;

  private readonly periods: { label: string; key: PlayerRatingTimePeriod }[] = [
    { label: 'Season', key: PlayerRatingTimePeriod.Season },
    { label: 'Last 7', key: PlayerRatingTimePeriod.Pr7 },
    { label: 'Last 15', key: PlayerRatingTimePeriod.Pr15 },
    { label: 'Last 30', key: PlayerRatingTimePeriod.Pr30 },
  ];

  get rows(): RatingRow[] {
    return this.periods.map(({ label, key }) => ({
      label,
      rating: this.playerRatings?.[key] ?? null,
    }));
  }
}
