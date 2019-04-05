// Global app controller
import axios from 'axios'

async function getResults(query){
  const key = '8a363216f63612e94e11adc5dbac740e';

  try {
    const res = await axios(`https://www.food2fork.com/api/search?key=${key}&q=${query}`);
    const recipes = res.data.recipes;
    console.log(recipes);
  } catch (error) {
    console.log(error);
  }
  
};

getResults('tomato pasta');



// https://www.food2fork.com/api/search 
// 8a363216f63612e94e11adc5dbac740e 