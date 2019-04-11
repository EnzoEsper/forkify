import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView'
import * as recipeView from './views/recipeView'
import {elements, renderLoader, clearLoader, elementStrings} from './views/base';

/* **ESTADO GLOBAL DE LA APP **
- Search object
- Current recipe object
- Shopping list object
- Liked recipies */
const state = {};

// CONTROLADOR SEARCH
const controlSearch = async () => {
  // 1. get query from the view
  const query = searchView.getInput(); //hacer luego

  if(query){
    // 2. New search object and add to state
    state.search = new Search(query);

    // 3. Prepare the UI interface for what is going to happen
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchRes)

    try {
      // 4. Search for recipies
      await state.search.getResults();
  
      // 5. Render results on the UI
      clearLoader();
      searchView.renderResults(state.search.result);
    } catch (error) {
      alert('Something wrong in the search...');
      clearLoader();
    }
  }
};

elements.searchForm.addEventListener('submit', e => {
  e.preventDefault();
  controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
  const btn = e.target.closest('.btn-inline');
  if (btn) {
    const goToPage = parseInt(btn.dataset.goto);
    searchView.clearResults();
    searchView.renderResults(state.search.result, goToPage);
  }

});

//CONTROLADOR RECIPE
const controlRecipe = async () => {
  // Se obtiene el ID de la URL
  const id = window.location.hash.replace('#', '');
  console.log(id);

  if (id) {
    // Preparar la UI para los cambios
    recipeView.clearRecipe(); 
    renderLoader(elements.recipe);
    // Crear un nuevo objeto recipe y modificar los
    state.recipe = new Recipe(id);
    
    
    try {
      // Obtener los datos del recipe
      await state.recipe.getRecipe();
      console.log(state.recipe.ingredients);
      state.recipe.parseIngredients();
  
      // Calcular porciones(serving) y tiempo(time)
      state.recipe.calcTime();
      state.recipe.calcServings();
      
      // Render the recipe
      clearLoader();
      recipeView.renderRecipe(state.recipe);

    } catch (error) {
      alert('Error processing recipe!');
    }
  }
}

/* 
window.addEventListener('hashchange', controlRecipe);
window.addEventListener('load', controlRecipe); 
ESTO SE PUEDE HACER EN UNA SOLA LINEA DE CODIGO*/
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));