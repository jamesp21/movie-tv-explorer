# 🎬 Movie & TV Show Explorer

A modern, responsive web application built with **Angular** that integrates with a public movie/TV API. Users can easily search, browse trending content, and view detailed information about their favorite films and television series.

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.21.

---

## 🚀 Features

*   **Live Search:** Quickly find movies or TV shows by typing keywords.
*   **Dynamic Browsing:** Explore categorized lists like *Trending*, *Popular*, and *Top Rated*.
*   **Detailed View:** Access plots, genres, release dates, runtime, ratings, and cast details.
*   **Responsive UI:** Optimized for a seamless experience on mobile, tablet, and desktop screens.
*   **State Management:** Smooth data flow and efficient API usage.

---

## 🛠️ Tech Stack

*   **Framework:** Angular (v17+)
*   **Language:** TypeScript
*   **Styling:** CSS/SCSS (or Tailwind CSS / Angular Material)
*   **API Source:** [The Movie Database (TMDb) API](https://themoviedb.org) (or your chosen API)

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your local machine:
*   [Node.js](https://nodejs.org) (LTS version recommended)
*   [Angular CLI](https://angular.io) (`npm install -g @angular/cli`)

---

## ⚙️ Installation & Setup

Follow these steps to get your local development environment running:

### 1. Clone the Repository
```bash
git clone https://github.com
cd movie-tv-explorer
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
1. Obtain an API key from your public movie database provider.
2. In the `src/environments/` folder, locate or create the environment files.
3. Add your API key and base URL configuration:

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiKey: 'YOUR_API_KEY_HERE',
  apiBaseUrl: 'https://themoviedb.org'
};
```

### 4. Run the Application
Start the local development server:
```bash
ng serve
```

### 5. Access the App
Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

---

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## 🧪 Running Tests

To run unit tests using Karma/Jasmine, execute:
```bash
ng test
```

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

---

## 🏗️ Future Enhancements

*   [ ] Add a "Favorites" list using browser local storage.
*   [ ] Implement advanced filtering (by genre, year, or rating).
*   [ ] Integrate movie trailers or video previews.
*   [ ] Add a dark mode toggle.

---

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
