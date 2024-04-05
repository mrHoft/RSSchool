import WinnersModel from './model';
import { createElement } from '~/utils/dom';
import type { TWinner } from '~/api/winners';
import Car from '~/widgets/car/car';
import { getCar } from '~/api/garage';

import './styles.css';

export default class WinnersView extends WinnersModel {
  protected $el: HTMLElement;
  protected $pageNum: HTMLElement;
  protected $winners: HTMLElement;
  protected $tbody: HTMLElement;
  protected $pagination: HTMLElement;
  protected $carId: HTMLElement;
  protected $carName: HTMLElement;
  protected $carWins: HTMLElement;
  protected $carTime: HTMLElement;

  constructor() {
    super();
    this.$el = createElement('div', { className: 'winners' });
    const title = createElement('div', { className: 'winners__title' });
    this.$pageNum = document.createElement('span');
    title.append(createElement('h1', { textContent: 'Winners' }), this.$pageNum);
    this.$winners = createElement('table', { className: 'winners__table' });
    this.$pagination = createElement('div', { className: 'winners__pagination' });
    this.$el.append(title, this.$winners, this.$pagination);

    const thead = createElement('thead', { className: 'winners__head' });
    const thr = document.createElement('tr');
    const carN = createElement('td', { textContent: '№' });
    this.$carId = createElement('td', { textContent: 'id', className: 'winners__order' });
    this.$carId.dataset.sort = 'id';
    this.$carId.dataset.order = ' \u2193';
    const carCase = createElement('td', {});
    this.$carName = createElement('td', { textContent: 'name' });
    this.$carWins = createElement('td', { textContent: 'wins', className: 'winners__order' });
    this.$carWins.dataset.sort = 'wins';
    this.$carWins.dataset.order = ' \u2191';
    this.$carTime = createElement('td', { textContent: 'time', className: 'winners__order sort' });
    this.$carTime.dataset.sort = 'time';
    this.$carTime.dataset.order = ' \u2193';
    thr.append(carN, carCase, this.$carId, this.$carName, this.$carWins, this.$carTime);
    thead.append(thr);
    this.$tbody = createElement('tbody', { className: 'winners__head' });
    this.$winners.append(thead, this.$tbody);
  }

  protected showWinners = (data: TWinner[]) => {
    this.$tbody.innerHTML = '';
    const len = Math.min(data.length, WinnersView.TOTAL);
    for (let i = 0; i <= len - 1; i += 1) {
      const tr = document.createElement('tr');
      const item = data[i];
      getCar(item.id).then(response => {
        if (typeof response !== 'string') {
          const carN = createElement('td', {
            textContent: ((this._page - 1) * WinnersView.TOTAL + i + 1).toString(),
          });
          const carId = createElement('td', { textContent: item.id.toString() });
          const carCase = document.createElement('td');
          carCase.append(new Car({ id: (item.id % 7) + 1, color: response.color }).el);
          const carName = createElement('td', { textContent: response.name });
          const carWins = createElement('td', { textContent: item.wins.toString() });
          const carTime = createElement('td', { textContent: item.time.toString() });
          tr.append(carN, carCase, carId, carName, carWins, carTime);
        }
      });
      this.$tbody.append(tr);
    }
  };
}
