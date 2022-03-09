import View from '../../ts/views/View';
import previewView from '../../ts/views/previewView';
import PreviewView from './previewView';

export interface Result {
  id: string;
  title: string;
  image: string;
  publisher: string;
}

export default class ResultsView extends View<Array<any>> {
  protected parentElement = document.querySelector('.results');
  protected errorMessage =
    'No recipes found for your query! Please try again ;)';
  protected message = '';
  protected previewView: PreviewView;

  constructor() {
    super();
    this.previewView = new PreviewView();
  }

  protected generateMarkup() {
    // console.log(this._data);
    return this.data
      .map(result => this.previewView.render(result, false))
      .join('');
  }
}

// export default new ResultsView();
