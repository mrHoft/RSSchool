import WinnersView from './view';
import { getWinners, TSort } from '~/api/winners';
import Pagination from '@/pagination/pagination';
import NoServerError from '@/error/error';
import modal from '@/modal/modal';

class Winners extends WinnersView {
  constructor() {
    super();
    this.$carId.onclick = this.changeSort;
    this.$carWins.onclick = this.changeSort;
    this.$carTime.onclick = this.changeSort;
  }

  private changeSort = (event: Event) => {
    const el = event.currentTarget as HTMLElement;
    if (el) {
      const arr = [this.$carId, this.$carWins, this.$carTime];
      const selected = el.className.includes('sort');
      const { order } = el.dataset;
      if (selected) {
        el.dataset.order = order === ' \u2191' ? ' \u2193' : ' \u2191';
        this._order = order === ' \u2191' ? 'ASC' : 'DESC';
      } else {
        el.classList.add('sort');
        arr.forEach(item => {
          if (item !== el) item.classList.remove('sort');
        });
        this._order = order === ' \u2191' ? 'DESC' : 'ASC';
        this._sort = el.dataset.sort as TSort;
      }
      this.updatePage();
    }
  };

  private updatePageInfo() {
    this.$pageNum.textContent = `Page: ${this._page}. Winners: ${Math.min(this._limit, this._total)}/${this._total}`;
  }

  private updatePage = () => {
    getWinners({ page: this._page, sort: this._sort, order: this._order }).then(data => {
      if (typeof data === 'string') {
        modal.show(NoServerError(data));
      } else {
        this._total = data.total;
        this.updatePageInfo();
        this.showWinners(data.winners);

        const pagination = new Pagination({
          total: this._total,
          current: this._page,
          limit: this._limit,
          callback: (page: number) => {
            this._page = page;
            this.updatePage();
          },
        }).el;
        if (pagination) {
          this.$pagination.innerHTML = '';
          this.$pagination.append(pagination);
        }
      }
    });
  };

  public get el() {
    this.updatePage();
    return this.$el;
  }
}

const winners = new Winners();
export default winners;
