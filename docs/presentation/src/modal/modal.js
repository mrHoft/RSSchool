const srcClose = "./assets/close.svg";

class Modal {
  #el;
  #inner;

  constructor() {
    this.#el = document.createElement("div");
    this.#el.className = "modal hidden";
    this.#el.onclick = this.#handleClick;

    const close = document.createElement("div");
    close.className = "modal__close";
    close.onclick = this.close;
    const closeImg = document.createElement("img");
    closeImg.src = srcClose;
    close.append(closeImg);

    this.#inner = document.createElement("div");
    this.#inner.className = "modal__inner";

    const outer = document.createElement("div");
    outer.className = "modal__outer";
    outer.append(close, this.#inner);

    this.#el.append(outer);
  }

  get el() {
    return this.#el;
  }

  show(fragment) {
    this.#el.classList.remove("hidden");
    this.#inner.replaceChildren(fragment);
  }

  close = () => {
    this.#el.classList.add("hidden");
  };

  #handleClick = event => {
    const { target, currentTarget } = event;
    if (target === currentTarget) {
      event.preventDefault();
      this.close();
    }
  };
}

const modal = new Modal();
export default modal;
