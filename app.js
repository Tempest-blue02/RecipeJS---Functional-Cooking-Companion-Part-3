(function() {
  'use strict';
  
  console.log('RecipeApp Part 3 initializing...');
  
  // PRIVATE DATA - Enhanced with steps/ingredients
  const recipes = [
    {
      id: 1, title: "Classic Spaghetti Carbonara", time: 25, difficulty: "easy",
      description: "A creamy Italian pasta dish...", category: "pasta",
      ingredients: ["400g spaghetti", "200g pancetta", "4 eggs", "150g pecorino"],
      steps: ["Boil water", {text: "Cook pasta", substeps: ["8-10 min", "Reserve water"]}, "Fry pancetta", "Mix eggs+cheese", "Toss & serve"]
    },
    {
      id: 2, title: "Chicken Tikka Masala", time: 45, difficulty: "medium",
      description: "Tender chicken in spiced sauce...", category: "curry",
      ingredients: ["500g chicken", "2 onions", "400g tomatoes", "yogurt", "spices"],
      steps: ["Marinate chicken", {text: "Make masala", substeps: ["Fry onions", {text: "Add spices", substeps: ["Turmeric", "Garam masala"]}]}, "Add chicken", "Simmer 20min"]
    },
    // Add remaining 6 recipes similarly (simple steps OK for others)
    {id: 3, title: "Greek Salad", time: 15, difficulty: "easy", description: "...", category: "salad",
     ingredients: ["cucumber", "tomatoes", "feta", "olives"], 
     steps: ["Chop veggies", "Mix dressing", "Toss together"]},
    // ... complete all 8
  ];
  
  // PRIVATE STATE
  let currentFilter = 'all';
  let currentSort = 'none';
  
  // PRIVATE DOM
  const recipeContainer = document.querySelector('#recipe-container');
  
  // PRIVATE: Recursive steps renderer
  const renderSteps = (steps, level = 0) => {
    return steps.map(step => {
      if (typeof step === 'string') {
        return `<li class="step">${step}</li>`;
      } else {
        const substeps = step.substeps ? renderSteps(step.substeps, level + 1) : '';
        const className = level === 0 ? 'step' : 'substep';
        return `
          <li class="${className}">
            ${step.text}
            ${substeps ? `<ol>${substeps}</ol>` : ''}
          </li>
        `;
      }
    }).join('');
  };
  
  // PRIVATE: Create recipe card HTML
  const createRecipeCard = recipe => `
    <div class="recipe-card" data-id="${recipe.id}">
      <h3>${recipe.title}</h3>
      <div class="recipe-meta">
        <span>⏱️ ${recipe.time} min</span>
        <span class="difficulty ${recipe.difficulty}">${recipe.difficulty}</span>
      </div>
      <p>${recipe.description}</p>
      <div class="toggle-buttons">
        <button class="toggle-btn" data-recipe-id="${recipe.id}" data-toggle="steps">Show Steps</button>
        <button class="toggle-btn" data-recipe-id="${recipe.id}" data-toggle="ingredients">Show Ingredients</button>
      </div>
      <div class="steps-container" data-recipe-id="${recipe.id}">
        <ol class="steps-list">${renderSteps(recipe.steps)}</ol>
      </div>
      <div class="ingredients-container" data-recipe-id="${recipe.id}">
        <ul>${recipe.ingredients.map(i => `<li>${i}</li>`).join('')}</ul>
      </div>
    </div>
  `;
  
  // PRIVATE: Toggle handler (event delegation)
  const handleToggleClick = e => {
    const btn = e.target.closest('.toggle-btn');
    if (!btn) return;
    
    const recipeId = btn.dataset.recipeId;
    const toggleType = btn.dataset.toggle;
    const container = recipeContainer.querySelector(`[data-recipe-id="${recipeId}"][class*="${toggleType}"]`);
    
    if (container) {
      const isVisible = container.classList.contains('visible');
      container.classList.toggle('visible');
      btn.textContent = isVisible ? `Show ${toggleType}` : `Hide ${toggleType}`;
    }
  };
  
  // PRIVATE: Render function
  const renderRecipes = recipesToRender => {
    recipeContainer.innerHTML = recipesToRender.map(createRecipeCard).join('');
  };
  
  // PRIVATE: Filter/sort pipeline
  const updateDisplay = () => {
    let displayRecipes = recipes;
    
    // Filter
    if (currentFilter !== 'all') {
      displayRecipes = displayRecipes.filter(r => 
        currentFilter === 'easy' ? r.difficulty === 'easy' :
        currentFilter === 'medium' ? r.difficulty === 'medium' :
        currentFilter === 'hard' ? r.difficulty === 'hard' :
        currentFilter === 'quick' ? r.time < 30 : displayRecipes
      );
    }
    
    // Sort
    if (currentSort === 'name') {
      displayRecipes = [...displayRecipes].sort((a,b) => a.title.localeCompare(b.title));
    } else if (currentSort === 'time') {
      displayRecipes = [...displayRecipes].sort((a,b) => a.time - b.time);
    }
    
    renderRecipes(displayRecipes);
    console.log(`Part 3: Showing ${displayRecipes.length} recipes`);
  };
  
  // PUBLIC API
  const RecipeApp = {
    init() {
      recipeContainer.addEventListener('click', handleToggleClick);
      // Add your filter/sort listeners here too
      updateDisplay();
      console.log('✅ RecipeApp Part 3 ready!');
    }
  };
  
  // AUTO-INIT
  RecipeApp.init();
  
})();
