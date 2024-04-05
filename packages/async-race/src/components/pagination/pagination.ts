import type { TPaginationProps } from './model';
import PaginationView from './view';

export default class Pagination extends PaginationView {
  constructor(props: TPaginationProps) {
    super();
    this._props = props;
  }

  private setControlls = () => {
    const index = this._props.current;
    let pages = ~~(this._props.total / this._props.limit) + 1;
    if ((pages - 1) * this._props.limit === this._props.total) pages -= 1;
    this.$current.textContent = `${index} / ${pages}`;

    if (index === 1) {
      this.$left.setAttribute('disabled', 'true');
    } else {
      this.$left.removeAttribute('disabled');
    }

    if (index === pages) {
      this.$right.setAttribute('disabled', 'true');
    } else {
      this.$right.removeAttribute('disabled');
    }

    for (let i = 0; i < 5; i += 1) {
      this.$page[i].classList.toggle('hidden', i + 1 > pages);
      let n = i + 1;
      if (pages > 3 && index > pages - 3) n = pages - 4 + i;
      else if (index > 3) n = Math.max(index - 2 + i, 1);
      this.$page[i].textContent = n.toString();
      if (n === index) {
        this.$page[i].setAttribute('disabled', 'true');
      } else {
        this.$page[i].removeAttribute('disabled');
      }
    }

    this.$first.classList.toggle('hidden', index <= 3);
    this.$last.classList.toggle('hidden', index + 3 >= pages);
    this.$last.textContent = pages.toString();
    if (index === pages) {
      this.$last.setAttribute('disabled', 'true');
    } else {
      this.$last.removeAttribute('disabled');
    }
  };

  private goLeft = () => {
    this._props.current -= 1;
    if (this._props.current < 1) this._props.current = 0;
    this.setControlls();
    this._props.callback(this._props.current);
  };

  private goRight = () => {
    this._props.current += 1;
    if (this._props.current > this._props.total) this._props.current = this._props.total;
    this.setControlls();
    this._props.callback(this._props.current);
  };

  private goPage = (event: MouseEvent) => {
    const target = event.currentTarget as HTMLElement;
    if (target) {
      const page = Number(target.textContent);
      this._props.current = page;
      this.setControlls();
      this._props.callback(this._props.current);
    }
  };

  private goLast = () => {
    let pages = ~~(this._props.total / this._props.limit) + 1;
    if ((pages - 1) * this._props.limit === this._props.total) pages -= 1;
    this._props.current = pages;
    this.setControlls();
    this._props.callback(this._props.current);
  };

  private goFirst = () => {
    this._props.current = 1;
    this.setControlls();
    this._props.callback(this._props.current);
  };

  private setListeners() {
    this.$left.onclick = this.goLeft;
    this.$right.onclick = this.goRight;
    for (let i = 0; i < 5; i += 1) {
      this.$page[i].onclick = this.goPage;
    }
    this.$first.onclick = this.goFirst;
    this.$last.onclick = this.goLast;
  }

  public get el() {
    if (this._props.total <= this._props.limit) return null;
    this.setControlls();
    this.setListeners();
    return this.$el;
  }
}
