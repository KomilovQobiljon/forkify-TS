import View from './View';
import PreviewView from './previewView';
import { Recipe } from '../model';

type Callback = () => void;

export default class BookmarksView extends View<Array<Recipe>> {
  protected parentElement = document.querySelector('.bookmarks__list');
  protected errorMessage =
    'No bookmarks yet, Find a nice recipe and bookmark it ;)';
  protected message = '';
  protected previewView: PreviewView;

  constructor() {
    super();
    this.previewView = new PreviewView();
  }

  addHandlerRender(handler: Callback) {
    window.addEventListener('load', handler);
  }

  protected generateMarkup = () => {
    return this.data
      .map(bookmark => this.previewView.render(bookmark, false))
      .join('');
  };
}
