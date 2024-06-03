import modal from "./modal.js";

let counter = 0;

function showModal() {
  const fragment = document.createDocumentFragment();
  const h1 = document.createElement("h1");
  h1.textContent = "Example";
  const p = document.createElement("p");
  p.textContent = "This is example modal window.";
  counter += 1;
  const count = document.createElement("p");
  count.textContent = `Counter: ${counter}`;
  fragment.append(h1, p, count);

  modal.show(fragment);
}

document.body.append(modal.el);
document.showModal = showModal;
