import { createElement } from '~/utils/dom';

import styles from './styles.module.css';

const srcSound = './assets/sound.svg';
const srcPlaying = './assets/loading.svg';

export class SpeechButton {
  private _el: HTMLElement;

  private _status: HTMLElement;

  private _audio: HTMLAudioElement | null = null;

  constructor(src?: string) {
    const [btn, status] = this.getSpeechButton();
    this._el = btn;
    this._status = status;

    if (src) this.audio = src;
  }

  public get el() {
    return this._el;
  }

  public set audio(src: string) {
    this._audio = new Audio(src);
    this._audio.addEventListener('play', () => {
      this._status.classList.remove('hidden');
    });
    this._audio.addEventListener('ended', () => {
      this._status.classList.add('hidden');
    });
  }

  private clickHandler = () => {
    if (this._audio) {
      this._audio.play();
    }
  };

  private getSpeechButton = () => {
    const btn = createElement('div', { className: styles.speech__btn, onClick: this.clickHandler });
    const status = createElement('img', {
      className: `${styles.speech__btn_active} hidden`,
      src: srcPlaying,
    });
    const icon = createElement('img', { className: styles.speech__btn_icon, src: srcSound });
    btn.append(status, icon);
    return [btn, status];
  };
}

const speechButton = new SpeechButton();
export default speechButton;
