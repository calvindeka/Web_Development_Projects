/**
 * Cocktail Finder - API Capstone Project
 * 
 * This application uses TheCocktailDB API to:
 * - Display a random cocktail on the homepage
 * - Search for cocktails by name
 * - Search for cocktails by ingredient
 * - View detailed cocktail recipes with ingredients and instructions
 * 
 * API Documentation: https://www.thecocktaildb.com/api.php
 * 
 * Author: Calvin Deka
 */

import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

// Initialize Express app
const app = express();
const port = 3000;

// TheCocktailDB API base URL (free, no authentication required)
const API_URL = "https://www.thecocktaildb.com/api/json/v1/1";

// Middleware setup
app.use(express.static("public")); // Serve static files from public folder
app.use(bodyParser.urlencoded({ extended: true })); // Parse form data

// Set EJS as the templating engine
app.set("view engine", "ejs");

/**
 * Helper function to extract ingredients from cocktail data
 * TheCocktailDB returns ingredients as strIngredient1, strIngredient2, etc.
 * and measurements as strMeasure1, strMeasure2, etc.
 * 
 * @param {Object} cocktail - The cocktail object from the API
 * @returns {Array} - Array of ingredient objects with name and measure
 */
function extractIngredients(cocktail) {
    const ingredients = [];
    
    // Loop through all possible ingredient slots (1-15)
    for (let i = 1; i <= 15; i++) {
        const ingredient = cocktail[`strIngredient${i}`];
        const measure = cocktail[`strMeasure${i}`];
        
        // Only add if ingredient exists and is not empty
        if (ingredient && ingredient.trim() !== "") {
            ingredients.push({
                name: ingredient.trim(),
                measure: measure ? measure.trim() : ""
            });
        }
    }
    
    return ingredients;
}

/**
 * GET / - Homepage
 * Displays a random cocktail to the user
 */
app.get("/", async (req, res) => {
    try {
        // Fetch a random cocktail from the API
        const response = await axios.get(`${API_URL}/random.php`);
        const cocktail = response.data.drinks[0];
        
        // Extract ingredients from the cocktail data
        const ingredients = extractIngredients(cocktail);
        
        // Render the homepage with the random cocktail
        res.render("index", {
            cocktail: cocktail,
            ingredients: ingredients,
            searchType: null,
            searchQuery: null,
            error: null
        });
    } catch (error) {
        // Log error for debugging
        console.error("Error fetching random cocktail:", error.message);
        
        // Render page with error message
        res.render("index", {
            cocktail: null,
            ingredients: null,
            searchType: null,
            searchQuery: null,
            error: "Unable to fetch cocktail. Please try again later."
        });
    }
});

/**
 * POST /search - Search for cocktails
 * Searches by name or ingredient based on user selection
 */
app.post("/search", async (req, res) => {
    const { searchType, query } = req.body;
    
    // Validate that a search query was provided
    if (!query || query.trim() === "") {
        return res.render("search-results", {
            cocktails: null,
            searchType: searchType,
            searchQuery: "",
            error: "Please enter a search term."
        });
    }
    
    try {
        let response;
        
        // Choose API endpoint based on search type
        if (searchType === "name") {
            // Search by cocktail name
            response = await axios.get(`${API_URL}/search.php`, {
                params: { s: query.trim() }
            });
        } else if (searchType === "ingredient") {
            // Search by ingredient (returns list of drinks)
            response = await axios.get(`${API_URL}/filter.php`, {
                params: { i: query.trim() }
            });
        } else {
            throw new Error("Invalid search type");
        }
        
        const cocktails = response.data.drinks;
        
        // Check if any results were found
        if (!cocktails || cocktails.length === 0) {
            return res.render("search-results", {
                cocktails: null,
                searchType: searchType,
                searchQuery: query,
                error: `No cocktails found for "${query}". Try a different search term.`
            });
        }
        
        // Render search results
        res.render("search-results", {
            cocktails: cocktails,
            searchType: searchType,
            searchQuery: query,
            error: null
        });
        
    } catch (error) {
        console.error("Error searching cocktails:", error.message);
        
        res.render("search-results", {
            cocktails: null,
            searchType: searchType,
            searchQuery: query,
            error: "Unable to search. Please try again later."
        });
    }
});

/**
 * GET /cocktail/:id - View cocktail details
 * Fetches and displays detailed information about a specific cocktail
 */
app.get("/cocktail/:id", async (req, res) => {
    const cocktailId = req.params.id;
    
    try {
        // Fetch cocktail details by ID
        const response = await axios.get(`${API_URL}/lookup.php`, {
            params: { i: cocktailId }
        });
        
        const cocktail = response.data.drinks ? response.data.drinks[0] : null;
        
        // Check if cocktail was found
        if (!cocktail) {
            return res.render("cocktail-detail", {
                cocktail: null,
                ingredients: null,
                error: "Cocktail not found."
            });
        }
        
        // Extract ingredients
        const ingredients = extractIngredients(cocktail);
        
        // Render cocktail detail page
        res.render("cocktail-detail", {
            cocktail: cocktail,
            ingredients: ingredients,
            error: null
        });
        
    } catch (error) {
        console.error("Error fetching cocktail details:", error.message);
        
        res.render("cocktail-detail", {
            cocktail: null,
            ingredients: null,
            error: "Unable to fetch cocktail details. Please try again later."
        });
    }
});

/**
 * GET /random - Get another random cocktail
 * Redirects to homepage which fetches a new random cocktail
 */
app.get("/random", (req, res) => {
    res.redirect("/");
});

/**
 * GET /categories - Browse by category
 * Lists all available cocktail categories
 */
app.get("/categories", async (req, res) => {
    try {
        // Fetch list of categories
        const response = await axios.get(`${API_URL}/list.php`, {
            params: { c: "list" }
        });
        
        const categories = response.data.drinks;
        
        res.render("categories", {
            categories: categories,
            error: null
        });
        
    } catch (error) {
        console.error("Error fetching categories:", error.message);
        
        res.render("categories", {
            categories: null,
            error: "Unable to fetch categories. Please try again later."
        });
    }
});

/**
 * GET /category/:name - View cocktails by category
 * Lists all cocktails in a specific category
 */
app.get("/category/:name", async (req, res) => {
    const categoryName = req.params.name;
    
    try {
        // Fetch cocktails by category
        const response = await axios.get(`${API_URL}/filter.php`, {
            params: { c: categoryName }
        });
        
        const cocktails = response.data.drinks;
        
        res.render("category-results", {
            cocktails: cocktails,
            categoryName: categoryName,
            error: null
        });
        
    } catch (error) {
        console.error("Error fetching category cocktails:", error.message);
        
        res.render("category-results", {
            cocktails: null,
            categoryName: categoryName,
            error: "Unable to fetch cocktails. Please try again later."
        });
    }
});

// 404 Handler - Catch all unmatched routes
app.use((req, res) => {
    res.status(404).render("404", {
        message: "Page not found"
    });
});

// Start the server
app.listen(port, () => {
    console.log(`🍹 Cocktail Finder is running at http://localhost:${port}`);
});
