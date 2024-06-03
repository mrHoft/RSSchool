import PuzzleModel from '../model/Puzzle';
import { getSettings, TSetting, TSettings } from '~/api/settings/settings';
import { getProgress, setProgress, TProgress } from '~/api/progress/progress';
import speechButton from '@/speech/speech';
import { getElement } from '~/utils/dom';

export default class PuzzleSettings extends PuzzleModel {
  private _settings: TSettings = {
    picture: true,
    sound: true,
    translation: true,
    dark: true,
  };

  private _progress: TProgress = {
    level: 0,
    round: -1,
    level_completed: '',
    round_completed: '',
  };

  protected get opt() {
    return this._settings;
  }

  protected get progress() {
    return this._progress;
  }

  protected roundCompleted(level: number) {
    return this._progress.round_completed
      .split(',')
      .filter(val => Number(val.charAt(0)) === level)
      .map(val => Number(val.split('_')[1]));
  }

  protected levelCompleted() {
    return this._progress.level_completed
      .split(',')
      .filter(val => val !== '')
      .map(val => Number(val));
  }

  protected refreshSettings() {
    this._settings = getSettings();
    this._progress = getProgress();
  }

  public setSetting(prop: TSetting, value: boolean) {
    this._settings[prop] = value;

    switch (prop) {
      case 'translation': {
        if (this.sourceText) this.sourceText.classList.toggle('hidden', !value);
        break;
      }
      case 'sound': {
        speechButton.el.classList.toggle('hidden', !value);
        break;
      }
      case 'picture': {
        const root = getElement<HTMLBaseElement>(':root');
        root.style.setProperty('--puzzle-hint-img', value ? `url(${this.game.image})` : 'unset');
        break;
      }
      default: {
        break;
      }
    }
  }

  protected setProgress(level: number, round: number) {
    this._progress.level = level;
    this._progress.round = round;
    const rec = `${level}_${round}`;
    const arr = this._progress.round_completed.split(',');
    if (!arr.includes(rec)) {
      arr.push(rec);
      this._progress.round_completed = arr.join(',');
    }
    setProgress(this._progress);
  }
}
