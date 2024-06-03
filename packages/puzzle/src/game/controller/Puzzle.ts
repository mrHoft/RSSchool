import { getElement } from '~/utils/dom';
import PuzzleView from '../view/Puzzle';
import { continueButton, resultsButton } from '@/ui/button';
import speechButton from '@/speech/speech';
import puzzleData, { type TCallback } from './Storage';
import shuffle from '~/utils/shuffle';
import showResults from '@/results/results';
import { resizeCard, flyCard } from '@/card';
import router from '~/utils/Router';
import sound from './Sound';
import message from '@/message/message';

const URL = 'https://raw.githubusercontent.com/rolling-scopes-school/rss-puzzle-data/main/';

class Puzzle extends PuzzleView {
  private _drag: Record<'item' | 'over' | 'neigh', HTMLElement | null> = {
    item: null,
    over: null,
    neigh: null,
  };

  private _field = { size: 0 };

  private isInitialized = false;

  constructor() {
    super();
    this.baseChangeCallback = this.baseChangeCallback.bind(this);
    this.dragEnter = this.dragEnter.bind(this);
    this.dragOver = this.dragOver.bind(this);
    this.dropCard = this.dropCard.bind(this);
  }

  private baseChangeCallback() {
    this.game.line = 1;
    this.game.skipped = [];
    this.game.passed = false;
    continueButton.state = 'hidden';
    resultsButton.state = 'hidden';
    const root = getElement<HTMLBaseElement>(':root');

    puzzleData.get().then(data => {
      this.game.image = `${URL}images/${data.levelData.imageSrc}`;
      root.style.setProperty('--puzzle-img', `url(${this.game.image})`);
      if (this.opt.picture) {
        root.style.setProperty('--puzzle-hint-img', `url(${this.game.image})`);
      }

      const { width, height } = this.puzzleBody.getBoundingClientRect();
      root.style.setProperty('--puzzle-size', `${width}px ${height}px`);

      const { height: rowHeight } = this.rows[1].getBoundingClientRect();
      this.rows.forEach((el, i) => {
        el.classList.remove('complete');
        this.removeDragReceiveListeners(el);
        el.style.backgroundPosition = `0px -${rowHeight * (i - 1)}px`;
      });
      this.marks.forEach(el => el.classList.remove('complete'));

      this.imageInfo.textContent = `${data.levelData.name} (${data.levelData.year})`;
      this.imageInfo.classList.add('hidden');

      data.words.forEach((item, i) => {
        this.setRow(i + 1, item.textExample);
        this.sentence[i] = item.textExample;
      });
    });
  }

  private levelChangeCallback = () => {
    const roundsTotal = puzzleData.round[this.game.level].length;
    this.game.rounds = roundsTotal;

    const roundCompleted = this.roundCompleted(this.game.level);
    const roundOptions = Array.from({ length: roundsTotal }, (_, i) => roundCompleted.includes(i));
    this.setOptions(this.pageSelect, roundOptions, this.game.page);

    const levelCompleted = this.levelCompleted();
    const levelOptions = Array.from({ length: 6 }, (_, i) => levelCompleted.includes(i));
    this.setOptions(this.levelSelect, levelOptions, this.game.level);
  };

  private lineChangeCallback = () => setTimeout(() => this.setSource(), 100);

  private nextRound() {
    this.setProgress(this.game.level, this.game.page);
    this.game.page += 1;
    const callbacks: TCallback[] = [
      this.baseChangeCallback,
      this.levelChangeCallback,
      this.lineChangeCallback,
    ];
    if (this.game.page >= this.game.rounds) {
      this.game.page = 0;
      this.game.level += 1;
      if (this.game.level > 5) this.game.level = 0;
      puzzleData.change({ level: this.game.level }, callbacks);
      return;
    }
    puzzleData.change({ page: this.game.page }, callbacks);
  }

  private changeHandler<T extends HTMLSelectElement>(event: Event) {
    const el = event.target as T;
    const { name } = el;
    const value = Number(el.value);
    const callbacks: TCallback[] = [this.baseChangeCallback, this.lineChangeCallback];
    if (name === 'level' || name === 'page') this.game[name] = value;
    if (name === 'level') {
      this.game.page = 0;
      callbacks.push(this.levelChangeCallback);
    }
    puzzleData.change({ [name]: value }, callbacks);
  }

  private showResults = () => {
    puzzleData.get().then(data => {
      showResults({
        level: this.game.level,
        round: this.game.page,
        src: `${URL}images/${data.levelData.imageSrc}`,
        name: data.levelData.name,
        year: data.levelData.year,
        words: data.words.map(item => ({
          sentence: item.textExample,
          sound: `${URL}${item.audioExample}`,
        })),
        skipped: this.game.skipped,
        onClick: this.continueHandler.bind(this),
      });
    });
  };

  private lineComplete() {
    Array.from(this.rows[this.game.line].children).forEach(el => el.classList.remove('active'));
    this.removeDragReceiveListeners(this.rows[this.game.line]);
    this.rows[this.game.line].classList.add('complete');
    this.marks[this.game.line].classList.add('complete');
  }

  private pageComplete() {
    this.imageInfo.classList.remove('hidden');
    this.lineComplete();
    if (this.opt.sound) sound.play('tada');
    resultsButton.state = 'ready';
    for (let i = 1; i <= 10; i += 1) {
      Array.from(this.rows[i].children).forEach(el => {
        el.textContent = '';
      });
    }
  }

  private continueHandler = () => {
    if (this.game.passed) {
      this.lineComplete();
      this.game.passed = false;
      this.game.line += 1;
      if (this.game.line <= 10) {
        this.setSource();
        return;
      }
      this.nextRound();
    } else {
      const isRightSentence = this.sentenceCheck();
      continueButton.state = isRightSentence ? 'ready' : 'fail';
      if (isRightSentence) {
        this.sourceText.classList.remove('hidden');
        speechButton.el.classList.remove('hidden');
        if (this.game.line === 10) {
          this.pageComplete();
        }
      }
    }
  };

  private sentenceCheck() {
    const arr = Array.from(this.rows[this.game.line].children);
    const sentence = arr.reduce((acc, el) => `${acc} ${el.textContent}`, '').trim();
    this.game.passed = this.sentence[this.game.line - 1] === sentence;
    if (this.game.passed && this.opt.sound) sound.play('match');
    return this.game.passed;
  }

  private checkSource() {
    if (this.sourceBlock.children.length === 0) {
      this.game.fullfilled = true;
      this.sourceBlock.classList.add('hidden');
      this.autoComplete.classList.add('hidden');
      continueButton.state = 'check';
    } else if (this.game.fullfilled) {
      this.game.fullfilled = false;
      this.sourceBlock.classList.remove('hidden');
      this.autoComplete.classList.remove('hidden');
      continueButton.state = 'hidden';
      this.game.passed = false;
    }
  }

  private setSource() {
    puzzleData.get().then(data => {
      this.sourceText.textContent = data.words[this.game.line - 1].textExampleTranslate;
      this.sourceText.classList.toggle('hidden', !this.opt.translation);
      speechButton.audio = `${URL}${data.words[this.game.line - 1].audioExample}`;
    });
    speechButton.el.classList.toggle('hidden', !this.opt.sound);
    this.sourceBlock.classList.remove('hidden');
    this.autoComplete.classList.remove('hidden');
    continueButton.state = 'hidden';

    const clickHandler = (event: Event) => {
      const el = event.currentTarget as HTMLDivElement;
      const { placed } = el.dataset;
      if (placed) {
        flyCard(el, this.sourceBlock);
        delete el.dataset.placed;
      } else {
        flyCard(el, this.rows[this.game.line]);
        el.dataset.placed = 'true';
      }
      if (this.opt.sound) sound.play('drop');
      this.checkSource();
    };

    this.setDragReceiveListeners(this.rows[this.game.line]);
    this.sourceBlock.innerHTML = '';
    this.items = Array.from(
      { length: this.rows[this.game.line].children.length },
      (_, i) => this.rows[this.game.line].children[i] as HTMLElement,
    );
    const arr = shuffle<HTMLElement>(this.items);
    arr.forEach(el => {
      this.sourceBlock.appendChild(el);
      el.classList.remove('opaque');
      el.classList.add('active');
      el.addEventListener('click', clickHandler);
      el.addEventListener('dragstart', this.dragStart.bind(this));
      el.addEventListener('dragend', this.dragEnd.bind(this));
      el.addEventListener('dragover', this.dragOverItem.bind(this));
    });
  }

  private autoCompleteHandler() {
    Array.from(this.rows[this.game.line].children).forEach(el => {
      this.sourceBlock.appendChild(el);
      delete (el as HTMLDivElement).dataset.placed;
    });
    this.items.forEach(el => {
      flyCard(el, this.rows[this.game.line], true);
      el.dataset.placed = 'true';
    });
    this.game.skipped.push(this.game.line - 1);
    this.checkSource();
    this.game.passed = true;
    continueButton.state = 'ready';
    if (this.game.line === 10) {
      this.pageComplete();
    }
  }

  private dragStart(event: DragEvent) {
    const self = event.target as HTMLDivElement;
    self.classList.add('drag');
    this._drag.item = self;
  }

  private dragEnd(event: DragEvent) {
    const self = event.target as HTMLDivElement;
    self.classList.remove('drag');
    this._drag.item = null;
  }

  private dragEnter(event: DragEvent) {
    event.preventDefault();
    const self = event.currentTarget as HTMLDivElement;
    self.classList.add('highlight');
  }

  private dragOver(event: DragEvent) {
    event.preventDefault();
  }

  private dragOverItem(event: DragEvent) {
    event.preventDefault();
    const self = event.currentTarget as HTMLDivElement;
    if (self !== this._drag.over) {
      if (this._drag.over) {
        this._drag.over.classList.remove('slide-left', 'slide-right');
      }
      if (this._drag.neigh) {
        this._drag.neigh.classList.remove('slide-left', 'slide-right');
      }
      this._drag.over = self;
      const boundingRect = self.getBoundingClientRect();
      const offset = boundingRect.x + boundingRect.width / 2;
      if (event.clientX - offset > 0) {
        self.classList.add('slide-left');
        const neigh = self.nextElementSibling as HTMLDivElement;
        if (neigh) {
          this._drag.neigh = neigh;
          neigh.classList.add('slide-right');
        }
      } else {
        self.classList.add('slide-right');
        const neigh = self.previousElementSibling as HTMLDivElement;
        if (neigh) {
          this._drag.neigh = neigh;
          neigh.classList.add('slide-left');
        }
      }
    }
  }

  private dropCard(event: DragEvent) {
    const self = event.currentTarget as HTMLDivElement;
    self.classList.remove('highlight');

    if (this._drag.item && this._drag.over && this._drag.over.parentElement === self) {
      if (
        event.clientX >
        this._drag.over.getBoundingClientRect().left + this._drag.over.offsetWidth / 2
      ) {
        self.insertBefore(this._drag.item, this._drag.over.nextSibling);
      } else {
        self.insertBefore(this._drag.item, this._drag.over);
      }
    } else if (this._drag.item) {
      self.append(this._drag.item);
      if (self !== this.sourceBlock) this._drag.item.dataset.placed = 'true';
    }
    if (this._drag.over) {
      this._drag.over.classList.remove('slide-left', 'slide-right');
    }
    if (this._drag.neigh) {
      this._drag.neigh.classList.remove('slide-left', 'slide-right');
    }
    if (this.opt.sound) sound.play('drop');
    this.game.passed = false;
    this.checkSource();
  }

  private setDragReceiveListeners(el: HTMLElement) {
    el.addEventListener('dragenter', this.dragEnter, true);
    el.addEventListener('dragover', this.dragOver, true);
    el.addEventListener('drop', this.dropCard, true);
  }

  private removeDragReceiveListeners(el: HTMLElement) {
    el.removeEventListener('dragenter', this.dragEnter, true);
    el.removeEventListener('dragover', this.dragOver, true);
    el.removeEventListener('drop', this.dropCard, true);
  }

  private resizeHandler = () => {
    if (router.getRoute()?.pathname !== '/game') return;

    const size = Math.floor(this.puzzleBody.getBoundingClientRect().width);
    if (size !== this._field.size) {
      this._field.size = size;

      const root = getElement<HTMLBaseElement>(':root');
      const { width, height } = this.puzzleBody.getBoundingClientRect();
      root.style.setProperty('--puzzle-size', `${width}px ${height}px`);

      const { height: rowHeight } = this.rows[1].getBoundingClientRect();
      this.rows.forEach((el, i) => {
        el.style.backgroundPosition = `0px -${rowHeight * (i - 1)}px`;
      });

      this.items.forEach(el => {
        this.rows[this.game.line].appendChild(el);
      });

      for (let i1 = 1; i1 < 11; i1 += 1) {
        const cards = this.rows[i1].children;
        const items = Array.from({ length: cards.length }, (_, i) => cards[i] as HTMLElement);
        items.forEach(card => {
          card.removeAttribute('style');
          card.classList.add('grow');
          card.classList.add('opaque');
        });
      }

      for (let i2 = 1; i2 < 11; i2 += 1) {
        const cards = this.rows[i2].children;
        const items = Array.from({ length: cards.length }, (_, i) => cards[i] as HTMLElement);
        items.forEach(card => {
          resizeCard(card);
          if (i2 <= this.game.line) card.classList.remove('opaque');
        });
      }

      this.items.forEach(el => {
        this.sourceBlock.appendChild(el);
        delete (el as HTMLDivElement).dataset.placed;
      });
    }
  };

  public init() {
    const field = this.drawField();
    this.refreshSettings();
    this.game.level = this.progress.level;
    this.game.page = this.progress.round + 1;
    if (this.game.level !== 0 || this.game.page !== 0) {
      message.show('Your progress was successfully restored');
    }
    puzzleData.change({ level: this.game.level, page: this.game.page }, [
      this.baseChangeCallback,
      this.levelChangeCallback,
      this.lineChangeCallback,
    ]);

    this.levelSelect.addEventListener('change', this.changeHandler.bind(this));
    this.pageSelect.addEventListener('change', this.changeHandler.bind(this));
    this.autoComplete.addEventListener('click', this.autoCompleteHandler.bind(this));
    this.setDragReceiveListeners(this.sourceBlock);

    if (!this.isInitialized) {
      window.addEventListener('resize', this.resizeHandler);
      continueButton.el.addEventListener('click', this.continueHandler);
      resultsButton.el.addEventListener('click', this.showResults);
      this.isInitialized = true;
    }
    return field;
  }
}

const puzzle = new Puzzle();
export default puzzle;
