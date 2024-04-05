import TrackView from './view';
import { getElement } from '~/utils/dom';
import type { TCar } from '~/api/garage/types';
import { deleteCar } from '~/api/garage';
import { switchEngine, startDrive } from '~/api/engine';
import { getWinner, createWinner, updateWinner } from '~/api/winners';
import manageCar from '../car/manage';
import message from '@/message/message';
import modal from '~/components/modal/modal';

export default class Track extends TrackView {
  private _updateCallback: () => void;
  private _garage: TCar[] = [];
  private _winner = 0;

  constructor(updateCallback: () => void) {
    super();
    this._updateCallback = updateCallback;

    this.$race.start.onclick = this.startRace;
    this.$race.return.onclick = this.stopRace;
  }

  public get(data: TCar[]) {
    this._garage = data;
    const fragment = this.getTrack(data);
    const len = Math.min(data.length, Track.TOTAL);
    for (let i = 0; i < len; i += 1) {
      this._status[i] = {
        id: data[i].id,
        name: data[i].name,
        color: data[i].color,
        started: false,
        timeline: 0,
        timer: 0,
        velocity: 0,
        distance: 0,
      };
      this.setListeners(i, data[i].id);
    }
    this.raceButtonsSwitch();

    return fragment;
  }

  private raceButtonsSwitch(state?: boolean) {
    if (state) {
      this.$race.start.setAttribute('disabled', 'true');
      this.$race.add.setAttribute('disabled', 'true');
      this.$race.del.setAttribute('disabled', 'true');
      this.$race.return.removeAttribute('disabled');
    } else {
      this.$race.return.setAttribute('disabled', 'true');
      this.$race.start.removeAttribute('disabled');
      this.$race.add.removeAttribute('disabled');
      this.$race.del.removeAttribute('disabled');
    }
  }

  private startRace = () => {
    this._winner = 0;
    this.raceButtonsSwitch(true);
    getElement('.menu__list').classList.add('disabled');

    // prettier-ignore
    const arr = this._garage.map((car, index) =>
      switchEngine(car.id, 'started').then(response => {
        if (typeof response !== 'string') {
          this._status[index].started = true;
          this._status[index].distance = response.distance;
          this._status[index].velocity = response.velocity;
        }
      }));

    let timeout = 0;
    Promise.all(arr).then(() => {
      this._garage.forEach((car, index) => {
        const { distance, velocity } = this._status[index];
        const duration = ~~(distance / velocity);
        timeout = Math.max(timeout, duration);
        this.animateCar(car.id, duration);
        startDrive(car.id).then(result => {
          if (result === 'fail') this.brokeCar(car.id);
          if (result === 'success' && !this._winner) this.showWinner(car.id);
        });
      });
      setTimeout(() => getElement('.menu__list').classList.remove('disabled'), (timeout / 3) * 2);
    });
  };

  private stopRace = () => {
    const arr = this._garage.map(car =>
      switchEngine(car.id, 'stopped').then(response => {
        if (typeof response !== 'string') {
          this.returnCar(car.id);
        }
      }),
    );
    Promise.allSettled(arr).then(() => this.raceButtonsSwitch());
  };

  private getIndexbyId(id: number) {
    for (let i = 0; i < Track.TOTAL; i += 1) {
      if (this._status[i].id === id) return i;
    }
    return -1;
  }

  private animateCar = (id: number, duration: number) => {
    const index = this.getIndexbyId(id);
    if (index !== -1) {
      if (this._status[index] && this._status[index].timer) {
        window.clearTimeout(this._status[index].timer);
      }
      this.$ctrl[index].start.setAttribute('disabled', 'true');
      this.$ctrl[index].start.classList.add('loading');
      this.$ctrl[index].edit.setAttribute('disabled', 'true');
      this.$ctrl[index].del.setAttribute('disabled', 'true');
      this.$ctrl[index].stop.removeAttribute('disabled');
      this.$car[index].classList.add('drive');
      this.$car[index].classList.remove('broken');
      this.$car[index].classList.remove('stop');
      this.$car[index].style.setProperty('--t', `${duration}ms`);
      this._status[index].timer = window.setTimeout(() => {
        this.$ctrl[index].start.classList.remove('loading');
        this._status[index].timeline = 100;
        this.$car[index].style.setProperty('--tl', '100%');
      }, duration);
      this._status[index].timestamp = new Date();
    }
  };

  private brokeCar = (id: number) => {
    const index = this.getIndexbyId(id);
    if (index !== -1 && this._status[index].started) {
      this.$car[index].classList.add('broken');
      if (this._status[index] && this._status[index].timer) {
        window.clearTimeout(this._status[index].timer);
        this.$ctrl[index].start.classList.remove('loading');
        const { timestamp, velocity, distance } = this._status[index];
        if (timestamp) {
          const duration = distance / velocity;
          const time = new Date().getTime() - timestamp.getTime();
          const timeline = Math.min(~~(((time + 500) / duration) * 100), 100);
          this._status[index].timeline = timeline;
          this.$car[index].style.setProperty('--tl', `${timeline}%`);
        }
      }
    }
  };

  public positionCheck() {
    this._garage.forEach((_, index) => {
      if (this._status[index].started) {
        this.$car[index].classList.remove('drive');
        this.$car[index].classList.add('stop');
      }
    });
  }

  private showWinner = (id: number) => {
    const index = this.getIndexbyId(id);
    if (index !== -1) {
      this._winner = id;
      const car = this._status[index];
      const { fragment, name, time } = this.getWinMessage();
      name.textContent = car.name;
      const duration = ~~(car.distance / car.velocity / 10) / 100;
      time.textContent = duration.toString();
      modal.show(fragment);

      getWinner(id).then(response => {
        if (typeof response === 'string') {
          createWinner({ id, wins: 1, time: duration });
        } else {
          updateWinner(id, {
            wins: response.wins + 1,
            time: Math.max(response.time, duration),
          });
        }
      });
    }
  };

  private returnCar = (id: number) => {
    const index = this.getIndexbyId(id);
    if (index !== -1) {
      if (this._status[index] && this._status[index].timer) {
        window.clearTimeout(this._status[index].timer);
        this.$ctrl[index].start.classList.remove('loading');
      }
      this.$ctrl[index].start.removeAttribute('disabled');
      this.$ctrl[index].edit.removeAttribute('disabled');
      this.$ctrl[index].del.removeAttribute('disabled');
      this.$ctrl[index].stop.setAttribute('disabled', 'true');
      this.$ctrl[index].stop.classList.remove('loading');
      this.$car[index].classList.remove('drive');
      this.$car[index].classList.remove('broken');
      this.$car[index].classList.remove('stop');
      this._status[index].started = false;
      this._status[index].timer = 0;
    }
  };

  private deleteCarHandler = (index: number, id: number) => {
    this.$ctrl[index].del.setAttribute('disabled', 'true');
    this.$ctrl[index].del.classList.add('loading');
    deleteCar(id).then(response => {
      if (typeof response === 'string') {
        message.show(response, 'error');
        return;
      }
      this._updateCallback();
    });
  };

  private startCarHandler = (index: number, id: number) => {
    this.$ctrl[index].start.setAttribute('disabled', 'true');
    this.$ctrl[index].start.classList.add('loading');

    switchEngine(id, 'started').then(response => {
      if (typeof response === 'string') {
        message.show(response, 'error');
        this.$ctrl[index].start.classList.remove('loading');
        this.$ctrl[index].start.removeAttribute('disabled');
        return;
      }

      this._status[index].started = true;
      this._status[index].velocity = response.velocity;
      this._status[index].distance = response.distance;
      this.animateCar(id, ~~(response.distance / response.velocity));
    });
  };

  private stopCarHandler = (index: number, id: number) => {
    this.$ctrl[index].stop.setAttribute('disabled', 'true');
    this.$ctrl[index].stop.classList.add('loading');

    switchEngine(id, 'stopped').then(response => {
      if (typeof response === 'string') {
        message.show(response, 'error');
        this.$ctrl[index].stop.classList.remove('loading');
        this.$ctrl[index].stop.removeAttribute('disabled');
        return;
      }
      this.returnCar(id);

      this._status[index].started = false;
      if (this._status.every(item => !item.started)) this.raceButtonsSwitch();
    });
  };

  private editCarHandler(index: number, id: number) {
    const { top, left } = manageCar.carSvg.getBoundingClientRect();
    const { top: carTop, left: carLeft } = this.$car[index].getBoundingClientRect();
    this.$car[index].style.setProperty(
      '--d',
      `${(left - carLeft).toFixed(2)}px, ${(top - carTop).toFixed(2)}px`,
    );
    this.$car[index].classList.add('fly');
    setTimeout(() => {
      this.$car[index].classList.remove('fly');
      const { color, name } = this._status[index];
      manageCar.setUpdate(this._updateCallback, id, index, color, name);
    }, 350);
  }

  private setListeners(index: number, id: number) {
    this.$ctrl[index].start.onclick = () => this.startCarHandler(index, id);
    this.$ctrl[index].stop.onclick = () => this.stopCarHandler(index, id);
    this.$ctrl[index].edit.onclick = () => this.editCarHandler(index, id);
    this.$ctrl[index].del.onclick = () => this.deleteCarHandler(index, id);
  }
}
