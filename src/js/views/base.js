// Se almacenan todos los elementos del DOM en este objeto para evitar un poco el acoplamiento
export const elements = {
  searchForm: document.querySelector('.search'),
  searchInput: document.querySelector('.search__field'),
  searchRes: document.querySelector('.results'),
  searchResultList: document.querySelector('.results__list'),
  searchResPages: document.querySelector('.results__pages'),
  recipe: document.querySelector('.recipe'),
  shopping: document.querySelector('.shopping__list')
};

export const elementStrings = {
  loader : 'loader',
}
// se pasa el parent como parametro, para enlazar al loader como un elemento hijo del padre
export const renderLoader = parent => {
  const loader = `
    <div class="${elementStrings.loader}">
      <svg>
        <use href="img/icons.svg#icon-cw"></use>
      </svg>
    </div>
  `;

  parent.insertAdjacentHTML('afterbegin', loader);
};

export const clearLoader = () => {
  const loader = document.querySelector(`.${elementStrings.loader}`);

  if(loader){
    loader.parentElement.removeChild(loader);
  }
};