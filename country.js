document.addEventListener("DOMContentLoaded", () => {
    const countryDetails = document.getElementById("countryDetails");
    const backBtn = document.getElementById("backBtn");
    const favoriteBtn = document.getElementById("favoriteBtn");
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    // Extract country name from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const countryName = urlParams.get("name");

    // Function to fetch country details using Restcountries API
    const fetchCountryDetails = async (name) => {
        try {
            const response = await fetch(`https://restcountries.com/v3.1/name/${name}?fullText=true`);
            if (!response.ok) throw new Error("Failed to fetch country details");

            const [country] = await response.json();
            displayCountryDetails(country);

            // Set initial favorite button text
            if (favorites.includes(country.name.common)) {
                favoriteBtn.textContent = "Unmark as Favorite";
            } else {
                favoriteBtn.textContent = "Mark as Favorite";
            }
        } catch (error) {
            console.error("Error fetching country details:", error);
            countryDetails.innerHTML = `<p>Unable to load country details. Please try again later.</p>`;
        }
    };

    // Function to display country details in the DOM
    const displayCountryDetails = (country) => {
        const flagUrl = country.flags.svg || country.flags.png || ""; // Use SVG or PNG flag URL

        countryDetails.innerHTML = `
            <h1>${country.name.common}</h1>
            <p>Top Level Domain: ${country.tld ? country.tld.join(", ") : "N/A"}</p>
            <p>Capital: ${country.capital ? country.capital[0] : "N/A"}</p>
            <p>Region: ${country.region || "N/A"}</p>
            <p>Population: ${country.population.toLocaleString() || "N/A"}</p>
            <p>Area: ${country.area ? `${country.area.toLocaleString()} km²` : "N/A"}</p>
            <p>Languages: ${country.languages ? Object.values(country.languages).join(", ") : "N/A"}</p>
            <img src="${flagUrl}" alt="Flag of ${country.name.common}" />
        `;
    };

    // Function to toggle favorite status
    const toggleFavorite = () => {
        if (favorites.includes(countryName)) {
            favorites.splice(favorites.indexOf(countryName), 1);
            favoriteBtn.textContent = "Mark as Favorite";
        } else if (favorites.length < 5) {
            favorites.push(countryName);
            favoriteBtn.textContent = "Unmark as Favorite";
        } else {
            alert("You can only favorite up to 5 countries.");
        }
        localStorage.setItem("favorites", JSON.stringify(favorites));
    };

    // Event listeners
    favoriteBtn.addEventListener("click", toggleFavorite);
    backBtn.addEventListener("click", () => window.history.back());

    // Fetch and display country details if countryName exists
    if (countryName) {
        fetchCountryDetails(countryName);
    } else {
        countryDetails.innerHTML = `<p>No country specified. Please select a country to view details.</p>`;
    }
});
