import icons from '../../img/icons.svg'; // Parcel 1

export default abstract class View<T> {
  protected data: T;
  protected abstract parentElement: Element;
  protected abstract generateMarkup(): string;
  protected errorMessage: string;
  protected message: string;

  render(data: T, render: boolean = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this.data = data;
    const markup = this.generateMarkup();

    if (!render) return markup;

    this.clear(markup);
  }

  update(data: T) {
    this.data = data;
    const newMarkup = this.generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkup);

    const newElements = Array.from(newDOM.querySelectorAll('*'));

    const curElements = Array.from(this.parentElement.querySelectorAll('*'));

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];

      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }

      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  protected clear = (markup: string) => {
    this.parentElement.innerHTML = '';
    this.parentElement.insertAdjacentHTML('afterbegin', markup);
  };

  renderSpinner() {
    const markup = `
      <div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div>
    `;

    this.clear(markup);
  }

  renderError(message = this.errorMessage) {
    const markup = `
      <div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `;

    this.clear(markup);
  }

  renderMessage(message = this.message) {
    const markup = `
      <div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `;

    this.clear(markup);
  }
}
