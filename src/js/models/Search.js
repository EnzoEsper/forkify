import axios from 'axios'
import {key} from '../config'

export default class Search {
  constructor(query){
    this.query = query;
  }

  async getResults(){
    
  
    try {
      const res = await axios(`https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
      this.result = res.data.recipes;
      /* console.log(this.result); */
    } catch (error) {
      console.log(error);
    }
  };
};


// https://www.food2fork.com/api/search 
// 8a363216f63612e94e11adc5dbac740e 