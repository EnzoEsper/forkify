import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import * as recipeView from './views/recipeView';
import {elements, renderLoader, clearLoader, elementStrings} from './views/base';

/* **ESTADO GLOBAL DE LA APP **
- Search object
- Current recipe object
- Shopping list object
- Liked recipies */
const state = {};

window.state = state;


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

    // Sombrear el elemento seleccionado
    if (state.search) {
      searchView.highlightSelected(id);
    }
    
    // Crear un nuevo objeto recipe y modificar los
    state.recipe = new Recipe(id);
    
    
    try {
      // Obtener los datos del recipe
      await state.recipe.getRecipe();
      state.recipe.parseIngredients();
  
      // Calcular porciones(serving) y tiempo(time)
      state.recipe.calcTime();
      state.recipe.calcServings();
      
      // Render the recipe
      clearLoader();
      recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));

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


// ***LIST CONTROLLER***

const controlList = () => {
  // crear una lista si todavia no existe ninguna
  if(!state.list) {
    state.list = new List();
  };

  // agregar cada ingrediente a la lista y a la UI
  state.recipe.ingredients.forEach(el => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
    listView.renderItem(item);
  })
};

// Eliminar y actualizar items de la lista
elements.shopping.addEventListener('click', e => {
  const id = e.target.closest('.shopping__item').dataset.itemid;

  // Manejar el boton delete
  if (e.target.matches('.shopping__delete, .shopping__delete *')) {
    // eliminar de state
    state.list.deleteItem(id);

    // eliminar de la UI
    listView.deleteItem(id);
  // Manejar la actualizacion de count  
  } else if (e.target.matches('.shopping__count-value')) {
    const val = parseFloat(e.target.value);
    state.list.updateCount(id, val);
  }
});

//CONTROLADOR LIKES

const controlLike = () => {
  if (!state.likes) {
    state.likes = new Likes();
  };
  const currentID = state.recipe.id;

  // El usuario dio like a la receta actual
  if (!state.likes.isLiked(currentID)) {
    //Agregar el like al estado
    const newLike = state.likes.addLike(
      currentID,
      state.recipe.title,
      state.recipe.author,
      state.recipe.img
    );
    //Toggle en el boton like
    likesView.toggleLikeBtn(true);
    //Agregar el like a la lista UI
    likesView.renderLike(newLike);
  // El usuario dio like a la receta
  } else {
    //Eliminar el like al estado
    state.likes.deleteLike(currentID);
    //Toggle en el boton like
    likesView.toggleLikeBtn(false);
    //Remover el like a la lista UI
    likesView.deleteLike(currentID);
  }

  likesView.toggleLikeMenu(state.likes.getNumLikes());
}

// Restaura los likes al recargar la pagina 
window.addEventListener('load' , () => {
  state.likes = new Likes();

  //Restaurar likes
  state.likes.readStorage();

  // Toggle en el boton like de menu
  likesView.toggleLikeMenu(state.likes.getNumLikes());

  // Renderear los likes existentes
  state.likes.likes.forEach(like => likesView.renderLike(like));
})

// Handling recipe button clicks
elements.recipe.addEventListener('click', e => {
  if (e.target.matches('.btn-decrease , .btn-decrease *')) {
    // Decrease button is clicked
    if (state.recipe.servings > 1) {
      state.recipe.updateServings('dec');
      recipeView.updateServingsIngredients(state.recipe);
    }
  } else if (e.target.matches('.btn-increase, .btn-increase *')) {
    // Decrease button is clicked
    state.recipe.updateServings('inc');
    recipeView.updateServingsIngredients(state.recipe);
  } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
    // Agregar los ingredientes a la lista de shopping
    controlList();
  } else if (e.target.matches('.recipe__love, .recipe__love *')) {
    //Like Controller
    controlLike();
  }
  
});

window.l = new List();
