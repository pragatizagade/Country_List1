Features
Search: Type a country name to find it in the list.
Filters: Filter countries by region and language.
Pagination: Load more countries as you scroll.
Favorites: Add or remove countries from your favorites list, with a limit of 5.
Detailed View: See detailed information about each country, including name, flag, region, population, area, and languages.

Usage:

Search and Filter:
Use the search box to find specific countries by name.
Filter by region or language using the dropdowns.

Add/Remove Favorites:
Click "Add to Favorites" to save a country as a favorite.
The button toggles to "Remove from Favorites" if a country is already added.
Click "Remove" next to a favorite in the favorites section to delete it.

Country Details:
Click on a country to go to the details page.
Use the "Mark as Favorite" button to save it as a favorite or "Unmark as Favorite" to remove it.


Code Structure:

index.html: Main page listing all countries with search, filter, and favorite functionalities.

country.html: Detailed view for each country with additional information.

main.js: Handles data fetching, rendering, and interactivity on index.html.

country.js: Manages data fetching and rendering for the country details page.

styles.css: Contains all styling for the application.

Technical Details:

main.js
API Fetching: Fetches all countries from the REST Countries API and populates the dropdowns.
Search and Filters: Filters countries by name, region, and language and displays results in pages.
Favorites: Manages favorites using localStorage, limiting the list to 5 countries.

Event Listeners: Handles input events for search, filters, and button clicks to update favorites and navigate.

country.js
Detailed View: Fetches specific country details and displays them on country.html.
Favorite Toggle: Toggles favorite status from the detailed view, updating localStorage.
