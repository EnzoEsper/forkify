import axios from 'axios'
import {key} from '../config'
import { parse } from 'path';

export default class Recipe {
  constructor(id) {
    this.id = id;
  }

  async getRecipe() {
    try {
      const res = await axios(`https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`);
      this.title = res.data.recipe.title;
      this.author = res.data.recipe.publisher;
      this.img = res.data.recipe.image_url;
      this.url = res.data.recipe.source_url;
      this.ingredients = res.data.recipe.ingredients;
    } catch (error) {
      console.log(error);
      alert('Something went wrong :(')
    }
  }

  calcTime(){
    // Solo como practica suponemos que por cada 3 ingredientes se estiman 15 minutos que se agregan al tiempo de preparacion de la receta
    const numIng = this.ingredients.length;
    const periods = Math.ceil(numIng / 3);
    this.time = periods * 15 ;
  }

  calcServings() {
    this.servings = 4;
  }

  parseIngredients () {
    const unitsLong = ['tablespoons', 'tablespoon', 'ounces' , 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
    const unitShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
    const units = [...unitShort, 'kg', 'g'];

    const newIngredients = this.ingredients.map(el => {
      // 1. Hacer las unidades uniformes
      let ingredient = el.toLowerCase();
      // Reemplaza en el ingrediente las unidades largas por las cortas
      unitsLong.forEach((unit, i) => {
        ingredient = ingredient.replace(unit, unitShort[i]);
      })

      // 2. Remover parentesis
      ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

      // 3. Parse ingredients into count, unit and ingredient
      const arrIng = ingredient.split(' ');
      const unitIndex = arrIng.findIndex(el2 => unitShort.includes(el2));
      
      let objIng;
      if (unitIndex > -1) {
        // Hay una unidad
        const arrCount = arrIng.slice(0, unitIndex);
        let count;

        if (arrCount.length === 1) {
          count = eval(arrIng[0].replace('-', '+'));
        } else {
          count = eval(arrIng.slice(0, unitIndex).join('+'));
        };

        objIng = {
          count,
          unit: arrIng[unitIndex],
          ingredient: arrIng.slice(unitIndex + 1).join(' ')
        };

      } else if (parseInt(arrIng[0], 10)) {
        // No hay una unidad, pero el primer elemento del arreglo es un numero
        objIng = {
          count: parseInt(arrIng[0], 10),
          unit: '',
          ingredient: arrIng.slice(1).join(' ')
        };

      } else if (unitIndex === -1) {
        // No hay una unidad
        objIng = {
          count: 1,
          unit: '',
          ingredient
        };
      } 

      return objIng;
    });

    this.ingredients = newIngredients;
  }

}

