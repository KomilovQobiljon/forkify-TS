type Callback = () => void;

export default class SearchView {
  private parentElement = document.querySelector('.search');

  getQuery() {
    const query = this.parentElement.querySelector(
      '.search__field'
    ) as HTMLInputElement;
    const queryValue = query.value;
    this.clearInput();
    return queryValue;
  }

  protected clearInput() {
    const searchField = this.parentElement.querySelector(
      '.search__field'
    ) as HTMLInputElement;
    searchField.value = '';
  }

  addHandlerSearch(handler: Callback) {
    this.parentElement.addEventListener('submit', e => {
      e.preventDefault();
      handler();
    });
  }
}

// export default new SearchView();
