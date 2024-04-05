import { createElement } from '~/utils/dom';
import parse from '~/utils/parser';
import { getSettings } from '~/api/settings/settings';

import './styles.css';

const url = './about.md';
const srcImg = './image/engineer-women.png';
const srcSmoke = './image/smoke1.gif';
const srcRace1 = './image/race1.svg';
const srcRace2 = './image/race2.svg';

function createRaceAnim() {
  const { dark } = getSettings();
  const container = createElement('div', { className: 'home__anim' });
  const smoke = createElement<HTMLImageElement>('img', {
    className: 'home__anim_smoke',
    src: srcSmoke,
    width: 33,
    height: 20,
    alt: '',
  });
  const img1 = createElement<HTMLImageElement>('img', {
    className: 'home__anim_img1',
    src: srcRace1,
    width: 100,
    height: 33,
    alt: '',
  });
  const img2 = createElement<HTMLImageElement>('img', {
    className: 'home__anim_img2',
    src: srcRace2,
    width: 67,
    height: 33,
    alt: '',
  });
  if (!dark) {
    img1.classList.add('invert');
    img2.classList.add('invert');
  }
  container.append(smoke, img1, img2);
  return container;
}

export default function Home() {
  const section = createElement('section', { className: 'home' });
  const wrap = createElement('div', { className: 'home__wrap' });
  const img = createElement<HTMLImageElement>('img', {
    className: 'home__img',
    src: srcImg,
    alt: 'engineer-women',
  });
  const about = createElement('div', { className: 'home__about' });
  wrap.append(about, img);
  section.append(wrap);
  fetch(url)
    .then(response => response.text())
    .then(data => about.append(parse(data), createRaceAnim()));

  return section;
}
