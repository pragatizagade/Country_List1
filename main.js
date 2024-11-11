const apiUrl = "https://restcountries.com/v3.1/all"; // New URL to fetch country data

document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("searchInput");
    const countryList = document.getElementById("countryList");
    const showMoreBtn = document.getElementById("showMoreBtn");
    const favoritesSection = document.getElementById("favoritesSection");
    const favoritesList = document.getElementById("favoritesList");
    const regionFilter = document.getElementById("regionFilter");
    const languageFilter = document.getElementById("languageFilter");

    let currentPage = 1; // Track the current page for pagination
    const itemsPerPage = 9; // Number of items to display per page
    let countriesData = [];
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    if (favorites.length > 0) favoritesSection.classList.remove("hidden");

    const initializeApp = async () => {
        try {
            const response = await fetch(apiUrl);
            countriesData = await response.json();

            populateLanguageDropdown(countriesData);
            fetchCountries();
        } catch (error) {
            console.error("Error fetching country data:", error);
        }
    };
    
    const populateLanguageDropdown = (data) => {
        const languageSet = new Set();
        data.forEach(country => {
            if (country.languages) {
                Object.values(country.languages).forEach(lang => languageSet.add(lang));
            }
        });
        const sortedLanguages = [...languageSet].sort();
        sortedLanguages.forEach(language => {
            const option = document.createElement("option");
            option.value = language;
            option.textContent = language;
            languageFilter.appendChild(option);
        });
    };

    const fetchCountries = (query = "", page = 1, region = "", language = "") => {
        const filteredData = countriesData.filter(country => {
            const matchesQuery = country.name.common.toLowerCase().includes(query.toLowerCase());
            const matchesRegion = region ? country.region === region : true;
            const matchesLanguage = language ? Object.values(country.languages || {}).includes(language) : true;
            return matchesQuery && matchesRegion && matchesLanguage;
        });

        renderCountryCards(filteredData.slice(0, page * itemsPerPage));
        
    };

    const renderCountryCards = countries => {
        countryList.innerHTML = ""; // Clear current list before rendering new data
        countries.forEach(country => {
            const flagUrl = country.flags?.svg || country.flags?.png || ""; // Get flag URL from API data

            const card = document.createElement("div");
            card.className = "country-card";
            card.innerHTML = `
                <h2>${country.name.common}</h2>
                <img src="${flagUrl}" alt="Flag of ${country.name.common}" />
                <button class="favorite-btn" data-country="${country.name.common}">${favorites.includes(country.name.common) ? 'Remove from Favorites' : 'Add to Favorites'}</button>
            `;
            card.addEventListener("click", () => {
                window.location.href = `country.html?name=${encodeURIComponent(country.name.common)}`;
            });
            countryList.appendChild(card);
        });

        document.querySelectorAll('.favorite-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                event.stopPropagation();
                const countryName = button.dataset.country;
                toggleFavorite(countryName);
            });
        });
    };

    const toggleFavorite = (countryName) => {
        if (favorites.includes(countryName)) {
            favorites = favorites.filter(fav => fav !== countryName);
            alert(`${countryName} removed from favorites.`);
        } else {
            if (favorites.length < 5) {
                favorites.push(countryName);
                alert(`${countryName} added to favorites.`);
            } else {
                alert("You can only have up to 5 favorites. Please remove one before adding a new one.");
                return;
            }
        }
        localStorage.setItem("favorites", JSON.stringify(favorites));
        updateFavorites();
        fetchCountries(searchInput.value, currentPage, regionFilter.value, languageFilter.value);
    };

    const updateFavorites = () => {
        favoritesList.innerHTML = "";
        favorites.forEach(countryName => {
            const li = document.createElement("li");
            li.textContent = countryName;
            const removeBtn = document.createElement("button");
            removeBtn.textContent = "Remove";
            removeBtn.addEventListener("click", (event) => {
                event.stopPropagation();
                removeFromFavorites(countryName);
            });
            li.appendChild(removeBtn);
            favoritesList.appendChild(li);
        });
        favoritesSection.classList.toggle("hidden", favorites.length === 0);
    };

    const removeFromFavorites = (countryName) => {
        favorites = favorites.filter(fav => fav !== countryName);
        alert(`${countryName} removed from favorites.`);
        updateFavorites();
        fetchCountries(searchInput.value, currentPage, regionFilter.value, languageFilter.value);
    };

    

    const updateSuggestions = (query) => {
        suggestions.innerHTML = ""; // Clear previous suggestions
        if (query.length > 0) {
            // Separate countries that match the query from those that don't
            const matchingCountries = countriesData.filter(country =>
                country.name.common.toLowerCase().startsWith(query.toLowerCase())
            );
    
            const remainingCountries = countriesData
                .filter(country => !country.name.common.toLowerCase().startsWith(query.toLowerCase()))
                .sort((a, b) => a.name.common.localeCompare(b.name.common)); // Sort remaining countries alphabetically
    
            // Display matching countries first
            matchingCountries.forEach(country => {
                const suggestionItem = document.createElement("div");
                suggestionItem.className = "suggestion-item";
                suggestionItem.textContent = country.name.common;
                suggestionItem.addEventListener("click", () => {
                    // Set the search input to the selected country's name
                    searchInput.value = country.name.common;
                    fetchCountries(searchInput.value); // Fetch countries based on the selected suggestion
                    suggestions.innerHTML = ""; // Clear suggestions after selection
                });
                suggestions.appendChild(suggestionItem);
            });
    
            // Display remaining countries below matching suggestions
            remainingCountries.forEach(country => {
                const suggestionItem = document.createElement("div");
                suggestionItem.className = "suggestion-item";
                suggestionItem.textContent = country.name.common;
                suggestionItem.addEventListener("click", () => {
                    // Set the search input to the selected country's name
                    searchInput.value = country.name.common;
                    fetchCountries(searchInput.value); // Fetch countries based on the selected suggestion
                    suggestions.innerHTML = ""; // Clear suggestions after selection
                });
                suggestions.appendChild(suggestionItem);
            });
        }
    };
    

    searchInput.addEventListener("input", () => {
        currentPage = 1;
        updateSuggestions(searchInput.value);

        fetchCountries(searchInput.value, currentPage, regionFilter.value, languageFilter.value);
    });

    regionFilter.addEventListener("change", () => {
        currentPage = 1;
        fetchCountries(searchInput.value, currentPage, regionFilter.value, languageFilter.value);
    });

    languageFilter.addEventListener("change", () => {
        currentPage = 1;
        fetchCountries(searchInput.value, currentPage, regionFilter.value, languageFilter.value);
    });

    showMoreBtn.addEventListener("click", () => {
        currentPage += 1;
        fetchCountries(searchInput.value, currentPage, regionFilter.value, languageFilter.value);
    });

    updateFavorites();
    initializeApp();
});
