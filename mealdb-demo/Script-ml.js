const fetchMealsBtn = document.getElementById("fetchMeals");
const mealsContainer = document.getElementById("mealsContainer");
const mealCountInput = document.getElementById("mealCount");

const mealModal = document.getElementById("mealModal");
const closeModal = document.querySelector(".close");
const mealTitle = document.getElementById("mealTitle");
const mealImg = document.getElementById("mealImg");
const mealCategory = document.getElementById("mealCategory");
const mealArea = document.getElementById("mealArea");
const mealIngredients = document.getElementById("mealIngredients");
const mealInstructions = document.getElementById("mealInstructions");
const prevMealBtn = document.getElementById("prevMeal");
const nextMealBtn = document.getElementById("nextMeal");

const feedbackInput = document.getElementById("feedbackInput");
const sendFeedbackBtn = document.getElementById("sendFeedback");

let mealsData = [];
let currentMealIndex = 0;


// Fetch random meals from api
async function fetchRandomMeals(count) {
  mealsContainer.innerHTML = "Loading meals...";
  let meals = [];
  for (let i = 0; i < count; i++) {
    const response = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
    const data = await response.json();
    meals.push(data.meals[0]);
  }
  mealsData = meals;
  displayMeals(meals);
}

// Display meals in a proper way 
function displayMeals(meals) {
  mealsContainer.innerHTML = "";
  meals.forEach((meal, index) => {
    const mealCard = document.createElement("div");
    mealCard.classList.add("meal-card");
    mealCard.innerHTML = `
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
      <h3>${meal.strMeal}</h3>
    `;
    mealCard.addEventListener("click", () => openMealModal(index));
    mealsContainer.appendChild(mealCard);
  });
}

// Open meal details by clicking on meal
function openMealModal(index) {
  currentMealIndex = index;
  const meal = mealsData[index];
  mealTitle.textContent = meal.strMeal;
  mealImg.src = meal.strMealThumb;
  mealCategory.textContent = meal.strCategory;
  mealArea.textContent = meal.strArea;
  mealIngredients.innerHTML = "";

  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim() !== "") {
      const li = document.createElement("li");
      li.textContent = `${ingredient} - ${measure}`;
      mealIngredients.appendChild(li);
    }
  }

  mealInstructions.textContent = meal.strInstructions;
  mealModal.style.display = "block";
}

// Close popup by clicking on the x icon on the pop up
closeModal.addEventListener("click", () => {
  mealModal.style.display = "none";
});
window.addEventListener("click", (event) => {
  if (event.target === mealModal) {
    mealModal.style.display = "none";
  }
});

// Next & Previous buttons for easy movement incase user enters large numbers
nextMealBtn.addEventListener("click", () => {
  currentMealIndex = (currentMealIndex + 1) % mealsData.length;
  openMealModal(currentMealIndex);
});
prevMealBtn.addEventListener("click", () => {
  currentMealIndex = (currentMealIndex - 1 + mealsData.length) % mealsData.length;
  openMealModal(currentMealIndex);
});

// Dark Mode Toggle
const darkModeToggle = document.getElementById("darkModeToggle");
darkModeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  if (document.body.classList.contains("dark-mode")) {
    darkModeToggle.textContent = "☀️";
  } else {
    darkModeToggle.textContent = "🌙 ";
  }
});


// button click
function isValidCount(value) {
  const n = Number(value);
  return Number.isInteger(n) && n > 0;
}

function updateFetchButtonState() {
  fetchMealsBtn.disabled = !isValidCount(mealCountInput.value);
}

// Keep the button disabled until the input is valid like when a user ebter 0 or an alphabet 
mealCountInput.addEventListener("input", updateFetchButtonState);
updateFetchButtonState();

// this part helps when a user doesn't input anything,it shouldn't give aby result
fetchMealsBtn.addEventListener("click", () => {
  const count = Number(mealCountInput.value);

  if (!Number.isInteger(count) || count <= 0) {
    alert("Please enter a valid positive number of meals.");
    return; 
  }

  fetchRandomMeals(count);
});

// Feedback POST request, from class slide with few additions from youtube
sendFeedbackBtn.addEventListener("click", async () => {
  const feedback = feedbackInput.value.trim();
  if (!feedback) {
    alert("Please enter feedback before sending!");
    return;
  }
  const feedbackData = {
    name: "username",
    feedback: feedback,
  };

  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      body: JSON.stringify({
        feedback: feedback,
        user: "Guest"
      }),
      headers: { "Content-type": "application/json; charset=UTF-8" }
    });

    const data = await response.json();
    console.log("Feedback Sent:", data);

    alert(" Feedback sent successfully!");
    feedbackInput.value = "";
  } catch (error) {
    console.error("Error sending feedback:", error);
    alert("Failed to send feedback. Try again.");
  }
});