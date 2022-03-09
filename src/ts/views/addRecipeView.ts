import { Recipe } from '../model';
import View from './View';

type Callback = (recipe: Recipe) => void;

export default class AddRecipeView extends View<Array<any>> {
  protected parentElement = document.querySelector('.upload');
  protected message = 'Recipe was successfully uploaded :)';

  protected window = document.querySelector('.add-recipe-window');
  protected overlay = document.querySelector('.overlay');

  protected btnOpen = document.querySelector('.nav__btn--add-recipe');
  protected btnClose = document.querySelector('.btn--close-modal');

  constructor() {
    super();
    this.addHandlerShowWindow();
    this.addHandlerHideWindow();
  }

  toggleWindow() {
    this.overlay.classList.toggle('hidden');
    this.window.classList.toggle('hidden');
  }

  private addHandlerShowWindow() {
    this.btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }

  private addHandlerHideWindow() {
    this.btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this.overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  addHandlerUpload(handler: Callback) {
    this.parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);
      console.log(data);

      handler(data);
    });
  }

  protected generateMarkup(): string {
    return '';
  }
}
