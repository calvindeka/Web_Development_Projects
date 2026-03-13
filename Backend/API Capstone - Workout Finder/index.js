/**
 * Workout Finder - API Capstone Project
 * 
 * This application uses the wger.de Workout Manager API to:
 * - Browse exercises by muscle group
 * - Search exercises by name
 * - Filter exercises by equipment
 * - View detailed exercise information with images
 * - Generate random workout suggestions
 * 
 * API Documentation: https://wger.de/en/software/api
 * 
 * Author: Calvin Deka
 */

import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

// Initialize Express app
const app = express();
const port = 3000;

// wger.de API base URL (free, no authentication required for read operations)
const API_URL = "https://wger.de/api/v2";

// Middleware setup
app.use(express.static("public")); // Serve static files
app.use(bodyParser.urlencoded({ extended: true })); // Parse form data

// Set EJS as the templating engine
app.set("view engine", "ejs");

/**
 * Cache for API data that doesn't change frequently
 * This reduces API calls and improves performance
 */
let muscleCache = null;
let categoryCache = null;
let equipmentCache = null;

/**
 * Fetches and caches muscle data from the API
 * Muscles are static data, so we cache them
 */
async function getMuscles() {
    if (muscleCache) return muscleCache;
    
    try {
        const response = await axios.get(`${API_URL}/muscle/`);
        muscleCache = response.data.results;
        return muscleCache;
    } catch (error) {
        console.error("Error fetching muscles:", error.message);
        return [];
    }
}

/**
 * Fetches and caches exercise categories from the API
 */
async function getCategories() {
    if (categoryCache) return categoryCache;
    
    try {
        const response = await axios.get(`${API_URL}/exercisecategory/`);
        categoryCache = response.data.results;
        return categoryCache;
    } catch (error) {
        console.error("Error fetching categories:", error.message);
        return [];
    }
}

/**
 * Fetches and caches equipment data from the API
 */
async function getEquipment() {
    if (equipmentCache) return equipmentCache;
    
    try {
        const response = await axios.get(`${API_URL}/equipment/`);
        equipmentCache = response.data.results;
        return equipmentCache;
    } catch (error) {
        console.error("Error fetching equipment:", error.message);
        return [];
    }
}

/**
 * Helper function to get muscle name by ID
 */
function getMuscleName(muscleId, muscles) {
    const muscle = muscles.find(m => m.id === muscleId);
    return muscle ? muscle.name_en || muscle.name : "Unknown";
}

/**
 * Helper function to get category name by ID
 */
function getCategoryName(categoryId, categories) {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : "Unknown";
}

/**
 * Helper function to strip HTML tags from text
 */
function stripHtml(html) {
    if (!html) return "";
    return html.replace(/<[^>]*>/g, "").trim();
}

/**
 * GET / - Homepage
 * Displays featured exercises and navigation options
 */
app.get("/", async (req, res) => {
    try {
        // Fetch categories and muscles for navigation
        const [categories, muscles] = await Promise.all([
            getCategories(),
            getMuscles()
        ]);
        
        // Fetch some exercises to feature (English language = 2)
        const exerciseResponse = await axios.get(`${API_URL}/exerciseinfo/`, {
            params: {
                language: 2,
                limit: 6
            }
        });
        
        const exercises = exerciseResponse.data.results;
        
        res.render("index", {
            categories: categories,
            muscles: muscles,
            featuredExercises: exercises,
            error: null
        });
    } catch (error) {
        console.error("Error loading homepage:", error.message);
        res.render("index", {
            categories: [],
            muscles: [],
            featuredExercises: [],
            error: "Unable to load exercises. Please try again later."
        });
    }
});

/**
 * GET /muscles - Browse by Muscle Group
 * Shows all available muscle groups
 */
app.get("/muscles", async (req, res) => {
    try {
        const muscles = await getMuscles();
        
        res.render("muscles", {
            muscles: muscles,
            error: null
        });
    } catch (error) {
        console.error("Error loading muscles:", error.message);
        res.render("muscles", {
            muscles: [],
            error: "Unable to load muscle groups."
        });
    }
});

/**
 * GET /muscle/:id - Exercises for specific muscle
 * Lists all exercises targeting a specific muscle
 */
app.get("/muscle/:id", async (req, res) => {
    const muscleId = req.params.id;
    
    try {
        const [muscles, exerciseResponse] = await Promise.all([
            getMuscles(),
            axios.get(`${API_URL}/exerciseinfo/`, {
                params: {
                    muscles: muscleId,
                    language: 2,
                    limit: 50
                }
            })
        ]);
        
        const muscle = muscles.find(m => m.id === parseInt(muscleId));
        const exercises = exerciseResponse.data.results;
        
        res.render("muscle-exercises", {
            muscle: muscle,
            exercises: exercises,
            error: null
        });
    } catch (error) {
        console.error("Error loading muscle exercises:", error.message);
        res.render("muscle-exercises", {
            muscle: null,
            exercises: [],
            error: "Unable to load exercises for this muscle group."
        });
    }
});

/**
 * GET /categories - Browse by Category
 * Shows exercise categories (Arms, Legs, Chest, etc.)
 */
app.get("/categories", async (req, res) => {
    try {
        const categories = await getCategories();
        
        res.render("categories", {
            categories: categories,
            error: null
        });
    } catch (error) {
        console.error("Error loading categories:", error.message);
        res.render("categories", {
            categories: [],
            error: "Unable to load categories."
        });
    }
});

/**
 * GET /category/:id - Exercises in category
 * Lists all exercises in a specific category
 */
app.get("/category/:id", async (req, res) => {
    const categoryId = req.params.id;
    
    try {
        const [categories, exerciseResponse] = await Promise.all([
            getCategories(),
            axios.get(`${API_URL}/exerciseinfo/`, {
                params: {
                    category: categoryId,
                    language: 2,
                    limit: 50
                }
            })
        ]);
        
        const category = categories.find(c => c.id === parseInt(categoryId));
        const rawExercises = exerciseResponse.data.results;
        
        // Process exercises for the view
        const exercises = rawExercises.map(exercise => {
            let name = "Exercise";
            if (exercise.exercises && exercise.exercises.length > 0) {
                const eng = exercise.exercises.find(e => e.language === 2) || exercise.exercises[0];
                name = eng.name;
            }
            return {
                id: exercise.id,
                name: name,
                image: exercise.images && exercise.images.length > 0 ? exercise.images[0].image : null,
                muscles: exercise.muscles ? exercise.muscles.map(m => m.name_en || m.name) : []
            };
        });
        
        res.render("category-exercises", {
            categoryName: category ? category.name : "Category",
            exercises: exercises,
            error: null
        });
    } catch (error) {
        console.error("Error loading category exercises:", error.message);
        res.render("category-exercises", {
            categoryName: "Category",
            exercises: [],
            error: "Unable to load exercises for this category."
        });
    }
});

/**
 * GET /equipment - Browse by Equipment
 * Shows all equipment types
 */
app.get("/equipment", async (req, res) => {
    try {
        const equipment = await getEquipment();
        
        res.render("equipment", {
            equipment: equipment,
            error: null
        });
    } catch (error) {
        console.error("Error loading equipment:", error.message);
        res.render("equipment", {
            equipment: [],
            error: "Unable to load equipment."
        });
    }
});

/**
 * GET /equipment/:id - Exercises with specific equipment
 */
app.get("/equipment/:id", async (req, res) => {
    const equipmentId = req.params.id;
    
    try {
        const [equipment, exerciseResponse] = await Promise.all([
            getEquipment(),
            axios.get(`${API_URL}/exerciseinfo/`, {
                params: {
                    equipment: equipmentId,
                    language: 2,
                    limit: 50
                }
            })
        ]);
        
        const equip = equipment.find(e => e.id === parseInt(equipmentId));
        const rawExercises = exerciseResponse.data.results;
        
        // Process exercises for the view
        const exercises = rawExercises.map(exercise => {
            let name = "Exercise";
            if (exercise.exercises && exercise.exercises.length > 0) {
                const eng = exercise.exercises.find(e => e.language === 2) || exercise.exercises[0];
                name = eng.name;
            }
            return {
                id: exercise.id,
                name: name,
                image: exercise.images && exercise.images.length > 0 ? exercise.images[0].image : null,
                muscles: exercise.muscles ? exercise.muscles.map(m => m.name_en || m.name) : []
            };
        });
        
        res.render("equipment-exercises", {
            equipmentName: equip ? equip.name : "Equipment",
            exercises: exercises,
            error: null
        });
    } catch (error) {
        console.error("Error loading equipment exercises:", error.message);
        res.render("equipment-exercises", {
            equipmentName: "Equipment",
            exercises: [],
            error: "Unable to load exercises for this equipment."
        });
    }
});

/**
 * GET /search - Search exercises
 * Searches exercises by name
 */
app.get("/search", async (req, res) => {
    const query = req.query.q || "";
    
    if (!query || query.trim() === "") {
        return res.render("search-results", {
            exercises: [],
            query: "",
            error: "Please enter a search term."
        });
    }
    
    try {
        // Search using the exerciseinfo endpoint with name filter
        const response = await axios.get(`${API_URL}/exerciseinfo/`, {
            params: {
                language: 2,
                limit: 50
            }
        });
        
        // Filter exercises by name (case-insensitive)
        const searchTerm = query.trim().toLowerCase();
        const allExercises = response.data.results || [];
        
        const filteredExercises = allExercises.filter(exercise => {
            // Check in translations
            if (exercise.exercises && exercise.exercises.length > 0) {
                return exercise.exercises.some(e => 
                    e.name && e.name.toLowerCase().includes(searchTerm)
                );
            }
            return false;
        }).map(exercise => {
            // Format exercise data
            const eng = exercise.exercises.find(e => e.language === 2) || exercise.exercises[0];
            return {
                id: exercise.id,
                name: eng.name,
                description: eng.description,
                image: exercise.images && exercise.images.length > 0 ? exercise.images[0].image : null,
                muscles: exercise.muscles ? exercise.muscles.map(m => m.name_en || m.name) : [],
                category: exercise.category ? exercise.category.name : null
            };
        });
        
        res.render("search-results", {
            exercises: filteredExercises,
            query: query,
            error: null
        });
    } catch (error) {
        console.error("Error searching exercises:", error.message);
        res.render("search-results", {
            exercises: [],
            query: query,
            error: "Unable to search. Please try again."
        });
    }
});

/**
 * POST /search - Search exercises (form submission)
 * Searches exercises by name
 */
app.post("/search", async (req, res) => {
    const { query } = req.body;
    res.redirect(`/search?q=${encodeURIComponent(query || "")}`);
});

/**
 * GET /exercise/:id - Exercise details
 * Shows detailed information about a specific exercise
 */
app.get("/exercise/:id", async (req, res) => {
    const exerciseId = req.params.id;
    
    try {
        const [muscles, categories, exerciseResponse] = await Promise.all([
            getMuscles(),
            getCategories(),
            axios.get(`${API_URL}/exerciseinfo/${exerciseId}/`)
        ]);
        
        const rawExercise = exerciseResponse.data;
        
        // Get English translation if available
        let name = "Exercise";
        let description = "";
        let notes = [];
        
        if (rawExercise.exercises && rawExercise.exercises.length > 0) {
            const englishVersion = rawExercise.exercises.find(e => e.language === 2);
            if (englishVersion) {
                name = englishVersion.name;
                description = englishVersion.description || "";
                notes = englishVersion.notes || [];
            } else {
                name = rawExercise.exercises[0].name;
                description = rawExercise.exercises[0].description || "";
                notes = rawExercise.exercises[0].notes || [];
            }
        }
        
        // Build exercise object for view
        const exercise = {
            id: rawExercise.id,
            name: name,
            description: description,
            notes: Array.isArray(notes) ? notes : [],
            category: rawExercise.category ? rawExercise.category.name : null,
            muscles: rawExercise.muscles ? rawExercise.muscles.map(m => m.name_en || m.name) : [],
            secondaryMuscles: rawExercise.muscles_secondary ? rawExercise.muscles_secondary.map(m => m.name_en || m.name) : [],
            equipment: rawExercise.equipment ? rawExercise.equipment.map(e => e.name) : [],
            images: rawExercise.images ? rawExercise.images.map(img => img.image) : [],
            variations: rawExercise.variations || []
        };
        
        res.render("exercise-detail", {
            exercise: exercise,
            error: null
        });
    } catch (error) {
        console.error("Error loading exercise:", error.message);
        res.render("exercise-detail", {
            exercise: { name: "Unknown Exercise" },
            error: "Unable to load exercise details."
        });
    }
});

/**
 * GET /random - Random workout generator
 * Generates a random workout with exercises from different categories
 */
app.get("/random", async (req, res) => {
    try {
        const [categories, muscles] = await Promise.all([
            getCategories(),
            getMuscles()
        ]);
        
        // Fetch random exercises from different categories
        const exerciseResponse = await axios.get(`${API_URL}/exerciseinfo/`, {
            params: {
                language: 2,
                limit: 100
            }
        });
        
        const allExercises = exerciseResponse.data.results;
        
        // Shuffle and pick 6 random exercises
        const shuffled = allExercises.sort(() => 0.5 - Math.random());
        const randomWorkout = shuffled.slice(0, 6);
        
        res.render("random-workout", {
            exercises: randomWorkout,
            muscles: muscles,
            categories: categories,
            error: null
        });
    } catch (error) {
        console.error("Error generating workout:", error.message);
        res.render("random-workout", {
            exercises: [],
            muscles: [],
            categories: [],
            error: "Unable to generate workout. Please try again."
        });
    }
});

// 404 Handler
app.use((req, res) => {
    res.status(404).render("404", {
        message: "Page not found"
    });
});

// Start the server
app.listen(port, () => {
    console.log(`💪 Workout Finder is running at http://localhost:${port}`);
});
