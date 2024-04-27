import { createElement } from '~/utils/dom';
import parse from '~/utils/parser';

import './styles.css';

const url = './about.md';
const srcImg = './image/people-01.svg';

export default function About() {
  const section = createElement('section', { className: 'home' });
  const wrap = createElement('div', { className: 'home__wrap' });
  const img = createElement<HTMLImageElement>('img', {
    className: 'home__img',
    src: srcImg,
    alt: 'boy',
  });
  const about = createElement('div', { className: 'home__about' });
  wrap.append(about, img);
  section.append(wrap);
  fetch(url)
    .then(response => response.text())
    .then(data => about.append(parse(data)));

  return section;
}
