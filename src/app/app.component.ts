import { ChangeDetectionStrategy, Component, LOCALE_ID, inject } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import localePt from '@angular/common/locales/pt';

registerLocaleData(localePt);

@Component({
  selector: 'ek-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  pageTitle = 'Avaliação';
}
