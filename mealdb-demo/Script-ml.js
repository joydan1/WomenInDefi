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
const username = document.getElementById("username");
const sendFeedbackBtn = document.getElementById("sendFeedback");

let mealsData = [];
let currentMealIndex = 0;

// Fetch random meals from API
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

// Open meal modal
function openMealModal(index) {
  currentMealIndex = index;
  const meal = mealsData[index];
  mealTitle.textContent = meal.strMeal;
  mealImg.src = meal.strMealThumb;
  mealCategory.textContent = meal.strCategory;
  mealArea.textContent = meal.strArea;
  mealIngredients.innerHTML = "";

  // Ingredients
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim() !== "") {
      const li = document.createElement("li");
      li.textContent = `${ingredient} - ${measure}`;
      mealIngredients.appendChild(li);
    }
  }

  // write Instructions as list
  mealInstructions.innerHTML = "";
  const steps = meal.strInstructions
    .split(/[\r\n]+/)   // split by line breaks
    .map(step => step.trim().replace(/^\d+\.\s*/, '')) // remove leading numbers so i have just the right numbering
    .filter(step => step.length > 0);

  steps.forEach(step => {
    const li = document.createElement("li");
    li.textContent = step;
    mealInstructions.appendChild(li);
  });

  mealModal.style.display = "block";
}


// Close modal
closeModal.addEventListener("click", () => {
  mealModal.style.display = "none";
});
window.addEventListener("click", (event) => {
  if (event.target === mealModal) {
    mealModal.style.display = "none";
  }
});

// Next / Prev meal navigation
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
    darkModeToggle.textContent = "🌙";
  }
});

// Validate meal count
function isValidCount(value) {
  const n = Number(value);
  return Number.isInteger(n) && n > 0;
}

function updateFetchButtonState() {
  fetchMealsBtn.disabled = !isValidCount(mealCountInput.value);
}

mealCountInput.addEventListener("input", updateFetchButtonState);
updateFetchButtonState();

// Fetch meals button
fetchMealsBtn.addEventListener("click", () => {
  const count = Number(mealCountInput.value);

  if (!Number.isInteger(count) || count <= 0) {
    showFeedbackPopup(" Please enter a valid positive number of meals.");
    return;
  }

  fetchRandomMeals(count);
});

// Feedback popup function
function showFeedbackPopup(message) {
  const popup = document.getElementById("feedbackPopup");
  popup.querySelector("p").textContent = message;
  popup.classList.remove("hidden");

  // Animate in
  setTimeout(() => popup.classList.add("show"), 50);

  // Hide after 3 seconds
  setTimeout(() => {
    popup.classList.remove("show");
    setTimeout(() => popup.classList.add("hidden"), 400);
  }, 3000);
}

// Feedback submission
sendFeedbackBtn.addEventListener("click", async () => {
  const feedback = feedbackInput.value.trim();
  const user = username.value.trim();

  if (!user || !feedback) {
    showFeedbackPopup("Please enter both username and feedback!");
    return;
  }

  const feedbackData = {
    name: user,
    feedback: feedback,
  };

  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: { "Content-type": "application/json; charset=UTF-8" },
      body: JSON.stringify(feedbackData),
    });

    const data = await response.json();
    console.log("Feedback Sent:", data);

    feedbackInput.value = "";
    username.value = "";

    showFeedbackPopup("Feedback sent successfully!");
  } catch (error) {
    console.error("Error sending feedback:", error);
    showFeedbackPopup("Failed to send feedback. Try again.");
  }
});
