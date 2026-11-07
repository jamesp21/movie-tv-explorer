import { Component, model, output } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.scss',
})
export class SearchBar {
  readonly searchSubmitted = output<string>();
  readonly query = model('');

  onSearch(event?: Event): void {
    event?.preventDefault();

    const trimmedQuery = this.query().trim();

    this.searchSubmitted.emit(trimmedQuery);
  }
}
