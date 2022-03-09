import Model, { Recipe } from '../ts/model';
import RecipeView from '../ts/views/recipeView';
import SearchView from '../ts/views/searchView';
import ResultsView from '../ts/views/resultsView';
import PaginationView from '../ts/views/PaginationView';
import BookmarksView from '../ts/views/bookmarksView';
import bookmarksView from '../ts/views/bookmarksView';
import AddRecipeView from './views/addRecipeView';
import { MODAL_CLOSE_SEC } from './config';

// const recipeContainer = document.querySelector('.recipe');

// if (module.hot) {
//   module.hot.accept();
// }

export class Controller {
  model: Model;
  recipeView: RecipeView;
  resultsView: ResultsView;
  searchView: SearchView;
  paginationView: PaginationView;
  bookmarksView: BookmarksView;
  addRecipeView: AddRecipeView;
  constructor() {
    this.model = new Model();
    this.recipeView = new RecipeView();
    this.searchView = new SearchView();
    this.resultsView = new ResultsView();
    this.paginationView = new PaginationView();
    this.bookmarksView = new BookmarksView();
    this.addRecipeView = new AddRecipeView();

    this.bookmarksView.addHandlerRender(this.controlBookmarks);
    this.recipeView.addHandlerRender(this.controlRecipes);
    this.recipeView.addHandlerUpdateServings(this.controlServings);
    this.recipeView.addHandlerAddBookmark(this.controlAddBookmark);
    this.searchView.addHandlerSearch(this.controlSearchResults);
    this.paginationView.addHandlerClick(this.controlPagination);
    this.addRecipeView.addHandlerUpload(this.controlAddRecipe);
  }

  controlRecipes = async () => {
    try {
      const id = window.location.hash.slice(1);

      if (!id) return;

      this.recipeView.renderSpinner();

      this.resultsView.update(this.model.getSearchResultsPage());

      await this.model.loadRecipe(id);

      this.recipeView.render(this.model.state.recipe);
    } catch (err) {
      // console.log(err);
      this.recipeView.renderError();
    }
  };

  controlSearchResults = async () => {
    try {
      // await model.loadSearchResults('pizza');
      // console.log(model.state.search.results);

      this.resultsView.renderSpinner();
      // 1) Get search query
      const query = this.searchView.getQuery();
      if (!query) return;

      // 2) Load search results
      await this.model.loadSearchResults(query);

      // 3) Render results
      this.resultsView.render(this.model.getSearchResultsPage());

      // 4) Render initial pagination buttons
      this.paginationView.render(this.model.state.search);
    } catch (error) {
      console.log(error);
    }
  };

  controlPagination = (gotoPage: number) => {
    console.log(this);
    // 1) Render new results
    this.resultsView.render(this.model.getSearchResultsPage(gotoPage));

    // 2) Render initial pagination buttons
    this.paginationView.render(this.model.state.search);
  };

  controlServings = (newServings: number) => {
    // Update the recipe servings (in state)
    this.model.updateServings(newServings);

    // Update the recipe view
    // recipeView.render(model.state.recipe);
    this.recipeView.update(this.model.state.recipe);
  };

  controlAddBookmark = () => {
    // Add/remove bookmark
    if (!this.model.state.recipe.bookmarked)
      this.model.addBookmark(this.model.state.recipe);
    else this.model.deleteBookmark(this.model.state.recipe.id);

    // 2) Update recipe view
    this.recipeView.update(this.model.state.recipe);

    // 3) Render bookmarks
    console.log(this);
    this.bookmarksView.render(this.model.state.bookmarks);
  };

  controlBookmarks = () => {
    this.bookmarksView.render(this.model.state.bookmarks);
  };

  controlAddRecipe = async (newRecipe: Recipe) => {
    try {
      // console.log(newRecipe);

      // Show loading spinner
      this.addRecipeView.renderSpinner();

      // Upload new recipe data
      await this.model.uploadRecipe(newRecipe);
      console.log(this.model.state.recipe);

      // Render recipe
      this.recipeView.render(this.model.state.recipe);

      // Success message
      this.addRecipeView.renderMessage();
      console.log(this.addRecipeView);

      // Render bookmark view
      this.bookmarksView.render(this.model.state.bookmarks);

      // Change ID in URL
      window.history.pushState(null, '', `#${this.model.state.recipe.id}`);

      // Close form window
      setTimeout(() => {
        console.log(this.addRecipeView);
        this.addRecipeView.toggleWindow();
      }, MODAL_CLOSE_SEC * 1000);
    } catch (error) {
      console.error('💥', error);
      this.addRecipeView.renderError(error.message);
    }
  };
}

const recipe = new Controller();
// recipe.controlRecipes();

// console.log(recipe);
// // setTimeout(() => {
// //   console.log(recipe);
// // }, 3000);

// ['hashchange', 'load'].forEach(event =>
//   window.addEventListener(event, recipe.controlRecipes)
// );
