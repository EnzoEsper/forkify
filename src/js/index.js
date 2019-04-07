import Search from './models/Search';
import * as searchView from './views/searchView'
import {elements} from './views/base';

/* **ESTADO GLOBAL DE LA APP **
- Search object
- Current recipe object
- Shopping list object
- Liked recipies */
const state = {};

const controlSearch = async () => {
  // 1. get query from the view
  const query = searchView.getInput(); //hacer luego

  if(query){
    // 2. New search object and add to state
    state.search = new Search(query);

    // 3. Prepare the UI interface for what is going to happen
    searchView.clearInput();
    searchView.clearResults();
    // 4. Search for recipies
    await state.search.getResults();

    // 5. Render results on the UI
    searchView.renderResults(state.search.result);
  }
};

elements.searchForm.addEventListener('submit', e => {
  e.preventDefault();
  controlSearch();
});