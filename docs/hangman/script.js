import wordsJson from "./assets/words.json" assert { type: "json" };
import Store from "./utils/store.js";
import { KEYS } from "./const/keys.js";

const store = new Store();

const MISS_MAX = 6;
const LETTERS = "abcdefghijklmnopqrstuvwxyz";

const state = {
  active: false,
  word: "",
  mistakes: 0,
  guessed: [],
  status: "",
  question: "",
  score: store.get("score") ?? 0,
};

function randomWord() {
  const last = store.get("word") ?? "";
  do {
    const theme = wordsJson[Math.floor(Math.random() * wordsJson.length)];
    const { question, words } = theme;
    state.question = question;
    state.word = words[Math.floor(Math.random() * words.length)];
  } while (last === state.word);

  store.set("word", state.word);
  state.active = true;
  document.querySelector(".guesser__word_question").textContent = `Hint: ${state.question}.`;
  console.log("Guessed word:", state.word);
}

function generateHeader() {
  const header = document.createElement("header");
  header.className = "header";
  document.body.append(header);

  const title = document.createElement("div");
  title.className = "header__title";

  const img = document.createElement("img");
  img.className = "header__title_img";
  img.src = "./assets/favicon.svg";
  img.alt = "hangman";

  const name = document.createElement("p");
  name.textContent = "Hangman game";
  title.append(img, name);

  const user = document.createElement("div");
  user.className = "user";

  const score_info = document.createElement("p");
  const score = document.createElement("span");
  score.textContent = "0";
  score.className = "user__score";
  score_info.append(document.createTextNode("Score: "), score);
  user.append(score_info);

  header.append(title, user);
}

function generatePage() {
  const main = document.createElement("main");
  main.className = "main";
  document.body.append(main);

  const container = document.createElement("wrapper-game");
  main.append(container);

  // Left side
  const stifler = document.createElement("section");
  stifler.className = "stifler";

  const img = document.createElement("img");
  img.className = "hangman__img";
  img.src = "./assets/0.svg";
  img.alt = "hangman";
  stifler.append(img);

  // Right side
  const guesser = document.createElement("section");
  guesser.className = "guesser";

  const guesser__word = document.createElement("div");
  guesser__word.className = "guesser__word";

  const sportlight = document.createElement("p");
  sportlight.className = "guesser__word_sportlight";
  const question = document.createElement("p");
  question.className = "guesser__word_question";
  const attempts = document.createElement("p");

  const mistakes = document.createElement("span");
  mistakes.className = "guesser__mistakes";
  mistakes.textContent = "0";
  const miss_max = document.createElement("span");
  miss_max.className = "guesser__max";
  miss_max.textContent = MISS_MAX;

  const counter = document.createElement("span");
  counter.className = "guesser__counter";
  counter.append(mistakes, document.createTextNode(" / "), miss_max);

  attempts.append(document.createTextNode("Incorrect guesses: "), counter);
  guesser__word.append(sportlight, question, attempts);

  const keyboard = document.createElement("div");
  keyboard.className = "guesser__keyboard";
  generateButtons(keyboard);

  const button = document.createElement("button");
  button.className = "btn guesser__btn";
  button.textContent = "Restart";
  button.addEventListener("click", reset);

  guesser.append(guesser__word, keyboard, button);

  container.append(stifler, guesser);
  document.addEventListener("keyup", keyboardHandler);
}

function generateModal() {
  const modal = document.createElement("div");
  modal.className = "modal hidden";
  document.body.append(modal);

  const inner = document.createElement("div");
  inner.className = "modal__inner";

  const result = document.createElement("p");
  result.className = "guesser__result";
  const word = document.createElement("p");
  word.className = "guesser__message";

  const button = document.createElement("button");
  button.className = "btn";
  button.textContent = "Play again";
  button.addEventListener("click", reset);

  inner.append(result, word, button);
  modal.append(inner);
}

function generateFooter() {
  const footer = document.createElement("footer");
  footer.className = "footer";
  document.body.append(footer);

  const author = document.createElement("div");
  author.className = "author";

  const copyright = document.createElement("p");
  copyright.textContent = "© 2022";
  const link = document.createElement("a");
  link.href = "https://github.com/mrHoft";
  link.textContent = "mrHoft";

  author.append(copyright, link);

  const rss = document.createElement("a");
  rss.className = "rss-logo";
  rss.href = "https://github.com/rolling-scopes-school";

  footer.append(author, rss);
}

function generateButtons(keyboard) {
  LETTERS.split("").map(letter => {
    const btn = document.createElement("button");
    btn.className = "btn btn__keyboard";
    btn.textContent = letter;
    keyboard.appendChild(btn);
    btn.addEventListener("click", handleClick);
  });
}

function resetButtons() {
  const keyboard = document.querySelector(".guesser__keyboard");
  keyboard.classList.remove("hidden");
  const btns = keyboard.querySelectorAll("button");
  for (const btn of btns) btn.removeAttribute("disabled");
}

function handleClick(event) {
  if (event && event.target) {
    event.preventDefault();
    const letter = event.target.textContent;
    handleGuess(letter, event.target);
  }
}

function keyboardHandler(event) {
  if (!state.active || !event) return;
  const char = KEYS[event.code];
  const index = char ? LETTERS.indexOf(char) : -1;
  if (index !== -1) {
    const keyboard = document.querySelector(".guesser__keyboard");
    const btns = keyboard.querySelectorAll("button");
    const btn = btns[index];
    if (!btn.getAttribute("disabled")) handleGuess(char, btn);
  }
}

function handleGuess(letter, btn) {
  state.guessed.indexOf(letter) === -1 ? state.guessed.push(letter) : null;
  if (btn) btn.setAttribute("disabled", true);

  if (state.word.indexOf(letter) >= 0) {
    guessedWord();
    checkWon();
  } else if (state.word.indexOf(letter) === -1) {
    state.mistakes++;
    updateMistakes();
    checkLost();
    updatePicture();
  }
}

function updatePicture() {
  document.querySelector(".hangman__img").src = `./assets/${state.mistakes}.svg`;
}

function showResult(result, message) {
  const modal = document.querySelector(".modal");
  modal.classList.remove("hidden");
  const resultEl = document.querySelector(".guesser__result");
  resultEl.textContent = result;
  const messageEl = document.querySelector(".guesser__message");
  messageEl.textContent = message;
  state.active = false;
}

function checkWon() {
  if (state.status.replace(/\s/g, "") === state.word) {
    state.score += 6 - state.mistakes;
    store.set("score", state.score);
    document.querySelector(".user__score").textContent = state.score;
    showResult("You Won!!!", `The word is: ${state.word}.`);
  }
}

function checkLost() {
  if (state.mistakes === MISS_MAX) {
    showResult("You Lost!!!", `The guessed word was: ${state.word}.`);
  }
}

function guessedWord() {
  state.status = state.word
    .split("")
    .map(letter => (state.guessed.indexOf(letter) >= 0 ? letter : "_"))
    .join(" ");

  document.querySelector(".guesser__word_sportlight").textContent = state.status;
}

function updateMistakes() {
  document.querySelector(".guesser__mistakes").textContent = state.mistakes;
}

function reset() {
  state.mistakes = 0;
  state.guessed = [];
  document.querySelector(".hangman__img").src = "./assets/0.svg";
  document.querySelector(".modal").classList.add("hidden");

  randomWord();
  guessedWord();
  updateMistakes();
  resetButtons();
}

function init() {
  console.log("(.)(.)"); // First of all
  generateHeader();
  generatePage();
  generateFooter();
  generateModal();
  randomWord();
  guessedWord();
  document.querySelector(".user__score").textContent = state.score;
}

init();
