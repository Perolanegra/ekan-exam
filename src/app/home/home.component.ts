import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  templateUrl: './home.component.html',
  styles: [
    `
      .repo-info {
        display: flex;
        justify-content: center;
        flex-direction: column;
        margin-top: 35px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  public pageTitle = 'Bem vindo ao EKAN Exame';
}
