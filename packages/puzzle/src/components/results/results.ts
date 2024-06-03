import { createElement } from '~/utils/dom';
import { SpeechButton } from '../speech/speech';
import modal from '@/modal/modal';

import './styles.css';

type TSentence = Record<'sentence' | 'sound', string>;

type TResultsProps = {
  level: number;
  round: number;
  src: string;
  name: string;
  year: string;
  words: TSentence[];
  skipped: number[];
  onClick: () => void;
};

const createList = (title: string, data: TSentence[]) => {
  const fragment = document.createDocumentFragment();
  const text = createElement('p', { className: 'results__words_title', textContent: title });
  const list = createElement('ul', { className: 'results__words_list' });
  list.append(
    ...data.map(item => {
      const li = createElement('li', { className: 'results__words_item' });
      li.append(new SpeechButton(item.sound).el, item.sentence);
      return li;
    }),
  );
  fragment.append(text, list);
  return fragment;
};

const showResults = ({ level, round, src, name, year, words, skipped, onClick }: TResultsProps) => {
  const fragment = document.createDocumentFragment();
  const header = createElement('h2', {
    className: 'results__title',
    textContent: 'Page completed!',
  });
  const lvl = createElement('p', {
    className: 'results__level',
    textContent: `Level: ${level + 1}. Page: ${round + 1}.`,
  });
  const thumb = createElement<HTMLImageElement>('img', {
    className: 'results__thumb',
    src,
    alt: 'thumbnail',
  });
  const descr = createElement('p', {
    className: 'results__descr',
    textContent: `${name} (${year})`,
  });

  const results = createElement('div', { className: 'results__words scrolled' });
  const solved = words.filter((_, i) => !skipped.includes(i));
  results.append(
    createList(
      `Solution used (${skipped.length}):`,
      words.filter((_, i) => skipped.includes(i)),
    ),
    createList(`Solved (${solved.length}):`, solved),
  );

  const btn = createElement('button', {
    className: 'button',
    textContent: 'Continue',
    onClick: () => {
      onClick();
      modal.close();
    },
  });

  fragment.append(header, lvl, thumb, descr, results, btn);
  modal.show(fragment);
};

export default showResults;
