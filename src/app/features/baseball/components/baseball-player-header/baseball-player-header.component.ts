import { Component, Input } from '@angular/core';
import { BaseballPlayer } from '../../models/baseball-player.model';
import { BaseballPlayerHeaderRatingComponent } from '../baseball-player-header-rating/baseball-player-header-rating.component';

@Component({
  selector: 'app-baseball-player-header',
  standalone: true,
  imports: [BaseballPlayerHeaderRatingComponent],
  templateUrl: './baseball-player-header.component.html',
})
export class BaseballPlayerHeaderComponent {
  @Input({ required: true }) player!: BaseballPlayer;
}
