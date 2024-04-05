import manageCar from '~/widgets/car/manage';
import getRandomCar from '~/widgets/car/random';
import { getGarage, deleteCar, createCar, updateCar } from '~/api/garage';
import modal from '@/modal/modal.ts';
import message from '@/message/message';
import GarageView from './view';
import NoServerError from '@/error/error';
import Track from '~/widgets/track/track';
import Pagination from '@/pagination/pagination';

import './styles.css';

class Garage extends GarageView {
  private _init = false;
  private _page = 1;
  private _limit = 7;
  private _total = 0;
  private _Track: Track;

  constructor() {
    super();
    manageCar.setCreateCallback(this.updatePage);
    this.$manage.append(manageCar.el);
    this._Track = new Track(this.updatePage);
  }

  private updatePageInfo() {
    this.$pageNum.textContent = `Page: ${this._page}. Cars: ${Math.min(this._limit, this._total)}/${this._total}`;
  }

  private updatePage = () => {
    getGarage(this._page).then(response => {
      if (typeof response === 'string') {
        modal.show(NoServerError(response));
      } else {
        this._total = response.total;
        this.updatePageInfo();
        this.$track.innerHTML = '';
        this.$track.append(this._Track.get(response.cars.slice(0, 7)));

        this.$pagination.innerHTML = '';
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
          this.$pagination.append(pagination);
        }
      }
    });
  };

  public generateCars = () => {
    const TOTAL = 100;
    const arr = new Array(TOTAL);

    for (let i = 0; i < TOTAL; i += 1) {
      arr[i] = createCar().then(response => {
        if (typeof response === 'string') {
          message.show(response, 'error');
          return;
        }
        getRandomCar().then(data => {
          updateCar(response.id, data);
        });
      });
    }

    Promise.allSettled(arr).then(settled => {
      const counter = settled.reduce((acc, item) => {
        if (item.status === 'fulfilled') {
          acc += 1;
        }
        return acc;
      }, 0);
      if (counter < TOTAL) {
        message.show(`Some car was not created: ${TOTAL - counter} of ${TOTAL}.`, 'error');
      } else {
        message.show(`Succesfuly created ${counter} cars.`);
      }
      setTimeout(this.updatePage, 100);
    });
  };

  public deleteAllCars = () => {
    let counter = 0;
    let loops = 0;
    const loop = () => {
      getGarage(1).then(response => {
        if (typeof response === 'string') {
          message.show(response, 'error');
        } else {
          if (!response.cars.length || !response.total) {
            message.show(`Succesfuly deleted ${counter} of ${this._total} cars.`);
            this.updatePage();
            return;
          }
          const arr = response.cars.map(item => deleteCar(item.id));
          Promise.allSettled(arr).then(() => {
            counter += response.cars.length;
            loops += 1;
            if (loops > 100) {
              message.show('Too many cars to delete!', 'error');
              this.updatePage();
              return;
            }
            loop();
          });
        }
      });
    };
    loop();
  };

  public get el() {
    if (!this._init) {
      this._init = true;
      this.updatePage();
    } else {
      this._Track.positionCheck();
    }
    return this.$el;
  }
}

const garage = new Garage();
export default garage;
