import { createElement } from '~/utils/dom';
import PuzzleSettings from '../controller/Settings';
import Card from '@/card/Card';
import { continueButton, resultsButton } from '@/ui/button';
import speechButton from '@/speech/speech';
import './styles.css';

export default class PuzzleView extends PuzzleSettings {
  protected setOptions(el: HTMLElement, options: boolean[], value = 0) {
    el.innerHTML = '';
    options.forEach((done, i) => {
      const option = new Option(
        `${(i + 1).toString()}${done ? ' \u2714' : ''}`,
        i.toString(),
        false,
        value === i,
      );
      option.className = `puzzle__select_option${done ? ' done' : ''}`;
      el.append(option);
    });
  }

  protected setRow(row: number, text: string) {
    const arr = text.split(' ');
    this.rows[row].innerHTML = '';
    arr.forEach((val, i) => {
      const { el } = new Card(val);
      if (i === 0) el.classList.add('first');
      else if (i === arr.length - 1) el.classList.add('last');
      else el.classList.add('mid');
      this.rows[row].append(el);
    });
  }

  protected drawField() {
    const container = createElement('div', { className: 'puzzle' });
    container.append(
      this.createSelectors(),
      this.createPuzzleBody(),
      this.createImageInfo(),
      this.createSourceBlock(),
    );

    return container;
  }

  protected createSelectors() {
    const level = createElement('label', {
      className: 'puzzle__level_label',
      textContent: 'Level ',
    });
    this.elements.levelSelect = createElement('select', {
      className: 'puzzle__level',
      name: 'level',
    });
    level.appendChild(this.elements.levelSelect);

    const page = createElement('label', { className: 'puzzle__page_label', textContent: 'Page ' });
    this.elements.pageSelect = createElement('select', { className: 'puzzle__page', name: 'page' });
    page.appendChild(this.elements.pageSelect);

    const selectors = createElement('div', { className: 'puzzle__select' });
    selectors.append(level, page);
    return selectors;
  }

  protected createPuzzleBody() {
    this.elements.puzzleBody = createElement('div', { className: 'puzzle__body' });
    for (let i = 1; i <= 10; i += 1) {
      const row = createElement<HTMLDivElement>('div', { className: `puzzle__row row_${i}` });
      this.rows[i] = row;
      const mark = createElement<HTMLDivElement>('div', {
        className: 'puzzle__row_mark',
        textContent: i.toString(),
      });
      this.marks[i] = mark;
      this.elements.puzzleBody.append(mark, row);
    }
    return this.elements.puzzleBody;
  }

  protected createImageInfo() {
    this.elements.imageInfo = createElement('div', { className: 'puzzle__image_info hidden' });
    return this.elements.imageInfo;
  }

  protected createSourceBlock() {
    const container = createElement('div', { className: 'puzzle__source_container' });

    const hintsBlock = createElement('div', { className: 'puzzle__hints' });
    this.elements.sourceText = createElement('p', { className: 'puzzle__source_text' });
    hintsBlock.append(speechButton.el, this.sourceText);

    this.elements.sourceBlock = createElement('div', { className: 'puzzle__source' });
    this.elements.autoComplete = createElement('div', {
      className: 'puzzle__source_auto',
      textContent: 'Auto-Complete',
    });
    const buttons = createElement('div', {});
    buttons.append(continueButton.el, resultsButton.el);
    container.append(hintsBlock, this.sourceBlock, this.autoComplete, buttons);
    return container;
  }
}
