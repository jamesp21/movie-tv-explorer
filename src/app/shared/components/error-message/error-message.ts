import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-error-message',
  standalone: true,
  imports: [],
  templateUrl: './error-message.html',
  styleUrl: './error-message.scss'
})
export class ErrorMessage {
  readonly message = input(
    'Something went wrong. Please try again.'
  );

  readonly retry = output<void>();
}