import { API_KEY } from '../ts/config';
import { API_URL, RES_PER_PAGE } from './config';
import { AJAX } from './helper';

export interface Recipe {
  id?: string;
  title?: string;
  publisher?: string;
  sourceUrl?: string;
  image?: string;
  servings?: number;
  cookingTime?: string;
  bookmarked?: boolean;
  key?: string;
  ingredients?: {
    quantity: number;
    unit: string;
    description: string;
  }[];
}

export interface State {
  recipe?: {
    id?: string;
    title?: string;
    publisher?: string;
    sourceUrl?: string;
    image?: string;
    servings?: number;
    cookingTime?: string;
    bookmarked?: boolean;
    key?: string;
    ingredients?: {
      quantity: number;
      unit: string;
      description: string;
    }[];
  };
  search?: {
    query: string;
    results: [];
    page: number;
    resultsPerPage: number;
  };
  bookmarks: Recipe[];
}

export default class Model {
  public state: State = {
    search: { query: '', results: [], page: 1, resultsPerPage: RES_PER_PAGE },
    bookmarks: [],
  };

  private storage: string;

  constructor() {
    this.storage = localStorage.getItem('bookmarks');
    if (this.storage) this.state.bookmarks = JSON.parse(this.storage);
  }

  createRecipeObject(data) {
    const { recipe } = data.data;
    return {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
      ...(recipe.key && { key: recipe.key }),
    };
  }

  async loadRecipe(id: string): Promise<void> {
    try {
      const data = await AJAX(`${API_URL}${id}?key=${API_KEY}`);

      this.state.recipe = this.createRecipeObject(data);

      if (this.state.bookmarks.some(bookmark => bookmark.id === id))
        this.state.recipe.bookmarked = true;
      else this.state.recipe.bookmarked = false;
    } catch (err) {
      console.log(`${err} 💥💥💥`);
      throw err;
    }
  }

  async loadSearchResults(query: string): Promise<void> {
    try {
      this.state.search.query = query;
      const { data } = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);
      // console.log('data:', data);

      this.state.search.results = data.recipes.map(
        (rec: {
          id: string;
          title: string;
          publisher: string;
          image_url: string;
        }) => {
          return {
            id: rec.id,
            title: rec.title,
            publisher: rec.publisher,
            image: rec.image_url,
          };
        }
      );

      // console.log('state.search.results:', state.search.results);
    } catch (error) {
      console.error(`${error} 💥💥💥`);
      throw error;
    }
  }

  getSearchResultsPage(page = this.state.search.page) {
    this.state.search.page = page;

    const start = (page - 1) * this.state.search.resultsPerPage;
    const end = page * this.state.search.resultsPerPage;

    return this.state.search.results.slice(start, end);
  }

  updateServings(newServings: number) {
    this.state.recipe.ingredients.forEach(ing => {
      if (typeof ing.quantity === 'number') {
        ing.quantity =
          Math.ceil(
            ((+ing.quantity * newServings) / +this.state.recipe.servings) * 100
          ) / 100;

        console.log(newServings, ing.quantity);
      }
    });

    this.state.recipe.servings = newServings;
  }

  persistBookmarks() {
    localStorage.setItem('bookmarks', JSON.stringify(this.state.bookmarks));
  }

  addBookmark(recipe: Recipe) {
    // Add Bookmark
    this.state.bookmarks.push(recipe);

    // Mark current recipe as bookmark
    if (recipe.id === this.state.recipe.id) this.state.recipe.bookmarked = true;
    this.persistBookmarks();
  }

  deleteBookmark(id: string) {
    // Delete bookmark
    const index = this.state.bookmarks.findIndex(el => el.id === id);
    this.state.bookmarks.splice(index, 1);

    // Mark current recipe as NOT bookmarked
    if (id === this.state.recipe.id) this.state.recipe.bookmarked = false;
    this.persistBookmarks();
  }

  uploadRecipe = async (newRecipe: Recipe) => {
    try {
      const ingredients = Object.entries(newRecipe)
        .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
        .map(ing => {
          const ingArr = ing[1].split(',').map(el => el.trim());
          if (ingArr.length !== 3)
            throw new Error(
              'Wrong ingredient format! Please use the correct format'
            );

          const [quantity, unit, description] = ingArr;

          return { quantity: quantity ? +quantity : null, unit, description };
        });

      const recipe = {
        title: newRecipe.title,
        source_url: newRecipe.sourceUrl,
        image_url: newRecipe.image,
        publisher: newRecipe.publisher,
        cooking_time: +newRecipe.cookingTime,
        servings: +newRecipe.servings,
        ingredients,
      };

      const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);
      console.log('data:', data);

      this.state.recipe = this.createRecipeObject(data);

      this.addBookmark(this.state.recipe);
    } catch (error) {
      throw error;
    }
  };
}
