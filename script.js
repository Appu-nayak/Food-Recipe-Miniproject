const searchBox = document.querySelector('.searchBox');
const searchBtn = document.querySelector('.searchBtn');
const recipeContainer = document.querySelector('.recipe-container');
const recipeDetailsContent = document.querySelector('.recipe-details-content');
const recipeCloseBtn = document.querySelector('.recipe-close-btn');

// Function to fetch recipes based on search query
const fetchRecipes = async (query) => {
    recipeContainer.innerHTML = "<h2>Fetching Recipes...</h2>";
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
        const data = await response.json();

        // Handle no recipes found
        if (!data.meals) {
            recipeContainer.innerHTML = "<h2>No recipes found. Try another search.</h2>";
            return;
        }

        // Clear previous content and display recipes
        recipeContainer.innerHTML = "";
        data.meals.forEach((meal) => {
            const recipeDiv = document.createElement('div');
            recipeDiv.classList.add('recipe');
            recipeDiv.innerHTML = `
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <h3>${meal.strMeal}</h3>
                <p><span>${meal.strArea}</span> Dish</p>
                <p>Belongs to <span>${meal.strCategory}</span> Category</p>
            `;
            const button = document.createElement('button');
            button.textContent = "View Recipe";
            button.classList.add('view-recipe-btn'); // Add a class for better control
            recipeDiv.appendChild(button);

            // Add event listener to open recipe details popup
            button.addEventListener('click', () => {
                openRecipePop(meal);
            });

            recipeContainer.appendChild(recipeDiv);
        });
    } catch (error) {
        recipeContainer.innerHTML = "<h2>Error fetching recipes. Please try again later.</h2>";
        console.error("Error fetching recipes:", error);
    }
};

// Function to fetch and format ingredients and measurements
const fetchIngredients = (meal) => {
    let ingredientsList = "";
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];

        // Only add ingredients that exist
        if (ingredient) {
            ingredientsList += `<li>${measure ? measure : ""} ${ingredient}</li>`;
        } else {
            break;
        }
    }
    return ingredientsList;
};

// Function to open the recipe details popup
const openRecipePop = (meal) => {
    recipeDetailsContent.innerHTML = `
        <h2 class="recipeName">${meal.strMeal}</h2>
        <h3>Ingredients:</h3>
        <ul class="ingredientList">${fetchIngredients(meal)}</ul>
        <div class="recipeInstructions">
            <h3>Instructions:</h3>
            <p>${meal.strInstructions}</p>
        </div>
    `;
    recipeDetailsContent.parentElement.style.display = "block";
};

// Event listener to close the recipe details popup
recipeCloseBtn.addEventListener('click', () => {
    recipeDetailsContent.parentElement.style.display = "none";
});

// Event listener for the search button
searchBtn.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent form submission
    const searchInput = searchBox.value.trim(); // Get the input value
    if (!searchInput) {
        recipeContainer.innerHTML = `<h2>Please type a meal name in the search box.</h2>`;
        return;
    }
    fetchRecipes(searchInput); // Fetch recipes based on search query
});
