import { objectKeys } from '~/utils/types';

type TAudioName = 'drop' | 'match' | 'tada';
type TSounds = Partial<Record<TAudioName, HTMLAudioElement>>;

const source: Record<TAudioName, string> = {
  drop: './assets/drop.mp3',
  match: './assets/match.mp3',
  tada: './assets/tada.mp3',
};

class Sound {
  private _audio: TSounds;

  constructor() {
    this._audio = objectKeys(source).reduce<TSounds>((acc, key) => {
      acc[key] = new Audio(source[key]);
      return acc;
    }, {});
  }

  public play(name: TAudioName) {
    this._audio[name]?.play();
  }
}

const sound = new Sound();
export default sound;
