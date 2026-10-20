import { Component, output, signal } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.scss'
})
export class SearchBar {
  readonly search = output<string>();

  readonly query = signal('');

  onSearch(): void {
    const trimmedQuery = this.query().trim();

    if (!trimmedQuery) {
      return;
    }

    this.search.emit(trimmedQuery);
  }
}