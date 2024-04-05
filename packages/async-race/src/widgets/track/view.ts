import TrackModel, { type TControls } from './model';
import { createElement } from '~/utils/dom';
import { objectKeys } from '~/utils/types';
import type { TCar } from '~/api/garage/types';
import Car from '~/widgets/car/car';
import { garage } from '~/pages';

import './styles.css';

const srcStart = './icons/start.svg';
const srcStop = './icons/stop.svg';
const srcEdit = './icons/settings.svg';
const srcDel = './icons/trash.svg';
const srcLoading = './icons/loading.svg';

function getIconLoading() {
  const icon = createElement<HTMLImageElement>('img', {
    src: srcLoading,
    alt: '',
    className: 'loading',
  });
  return icon;
}

export default class TrackView extends TrackModel {
  private $controls: TControls;
  protected $race: Record<'start' | 'return' | 'add' | 'del', HTMLButtonElement>;

  constructor() {
    super();
    this.$controls = this.makeControls();
    this.$race = this.getRaceSection();
  }

  protected getTrack(data: TCar[]) {
    const fragment = document.createDocumentFragment();
    const raceSection = createElement('div', { className: 'track__race' });
    raceSection.append(...Object.values(this.$race));
    fragment.append(raceSection);

    const len = Math.min(data.length, TrackView.TOTAL);
    for (let i = 0; i < len; i += 1) {
      const item = data[i];
      const row = createElement('div', { className: 'track__row' });
      const info = createElement('div', { className: 'track__car_info' });
      const name = createElement('div', {
        className: 'track__car_name',
        textContent: `${item.id}: ${item.name}`,
      });
      const dummy = createElement('div', { className: 'track__car_dummy' });
      info.append(name, this.getControls(i), dummy);

      this.$car[i] = createElement('div', { className: 'track__car' });
      const svgCar = new Car({ id: (item.id % 7) + 1, color: item.color }).el;
      svgCar.classList.add('track__car');
      this.$car[i].append(svgCar);
      row.append(info, this.$car[i]);
      fragment.append(row);
    }

    return fragment;
  }

  protected getWinMessage() {
    const fragment = document.createDocumentFragment();
    const title = createElement('h2', { textContent: 'We have a winner!' });
    const message = document.createElement('p');
    const name = document.createElement('span');
    const time = document.createElement('span');
    message.append(name, ' was finished first in ', time, ' seconds.');

    fragment.append(title, message);
    return { fragment, name, time };
  }

  protected getControls(index: number) {
    const el = createElement('div', { className: 'track__car_ctrls' });
    this.$ctrl[index] = objectKeys(this.$controls).reduce(
      (acc, key) => {
        const ctrl = this.$controls[key];
        acc[key] = <HTMLButtonElement>ctrl.cloneNode(true);
        return acc;
      },
      <TControls>{},
    );
    el.append(...Object.values(this.$ctrl[index]));
    return el;
  }

  private makeControls() {
    const start = createElement<HTMLButtonElement>('button', {
      className: 'track__car_btn',
    });
    const iconStart = createElement<HTMLImageElement>('img', { src: srcStart, alt: '' });
    start.append(iconStart, getIconLoading());

    const stop = createElement<HTMLButtonElement>('button', {
      className: 'track__car_btn',
      disabled: true,
    });
    const iconStop = createElement<HTMLImageElement>('img', { src: srcStop, alt: '' });
    stop.append(iconStop, getIconLoading());

    const edit = createElement<HTMLButtonElement>('button', {
      className: 'track__car_btn',
    });
    const iconEdit = createElement<HTMLImageElement>('img', { src: srcEdit, alt: '' });
    edit.append(iconEdit);

    const del = createElement<HTMLButtonElement>('button', {
      className: 'track__car_btn',
    });
    const iconDel = createElement<HTMLImageElement>('img', { src: srcDel, alt: '' });
    del.append(iconDel, getIconLoading());

    return { start, stop, edit, del };
  }

  private getRaceSection() {
    return {
      start: createElement<HTMLButtonElement>('button', {
        className: 'button',
        textContent: 'Start all',
      }),
      return: createElement<HTMLButtonElement>('button', {
        className: 'button',
        textContent: 'Return all',
        disabled: true,
      }),
      add: createElement<HTMLButtonElement>('button', {
        className: 'button',
        textContent: 'Generate x100',
        onClick: () => garage.generateCars(),
      }),
      del: createElement<HTMLButtonElement>('button', {
        className: 'button',
        textContent: 'Delete all',
        onClick: () => garage.deleteAllCars(),
      }),
    };
  }
}
