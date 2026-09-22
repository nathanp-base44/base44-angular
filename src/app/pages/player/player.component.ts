import { Component } from '@angular/core';
import { BaseballPlayerHeaderComponent } from '../../features/baseball/components/baseball-player-header/baseball-player-header.component';
import { BaseballPlayer, PlayerRatingTimePeriod } from '../../features/baseball/models/baseball-player.model';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [BaseballPlayerHeaderComponent],
  template: `
    <section class="mx-auto max-w-md px-6 py-16">
      <app-baseball-player-header [player]="player" />
    </section>
  `,
})
export class PlayerComponent {
  player: BaseballPlayer = {
    id: '39832',
    name: 'Shohei Ohtani',
    img: 'https://a.espncdn.com/combiner/i?img=/i/headshots/mlb/players/full/39832.png&w=350&h=254',
    team: 'LAD',
    position: 'DH',
    playerRatings: {
      [PlayerRatingTimePeriod.Season]: { totalRating: 92.45, positionalRanking: 1 },
      [PlayerRatingTimePeriod.Pr7]: { totalRating: 12.3, positionalRanking: 4 },
      [PlayerRatingTimePeriod.Pr15]: { totalRating: 28.912, positionalRanking: 2 },
      // Pr30 intentionally omitted to show the '-' fallback
    },
  };
}
