
import { Component, output, signal } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.scss'
})
export class SearchBar {
  readonly searchSubmitted = output<string>();
  readonly query = signal('');

  onSearch(event?: Event): void {
    console.log('Search value:', this.query(), 'Type:', typeof this.query());
    event?.preventDefault();

    const trimmedQuery = this.query().trim();

    if (!trimmedQuery) {
      return;
    }

    this.searchSubmitted.emit(trimmedQuery);
  }
}