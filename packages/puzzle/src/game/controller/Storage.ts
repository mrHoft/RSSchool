import DataStorage, { type TRoundData } from '../model/Storage';

const URL = (i: number) => `./data/wordCollectionLevel${i + 1}.json`;

export type TCallback = () => void;

class PuzzleData extends DataStorage {
  private _state = { level: 0, page: 0 };

  get() {
    const { level, page } = this._state;
    return new Promise<TRoundData>(resolve => {
      if (this.round[level]) {
        const len = this.round[level].length;
        if (page >= len) {
          resolve(this.round[level][len - 1]);
          return;
        }
        resolve(this.round[level][page]);
      } else {
        fetch(URL(level), { method: 'GET', headers: { Accept: 'application/json' } })
          .then(response => response.json())
          .then(data => {
            if (data && Object.prototype.hasOwnProperty.call(data, 'rounds')) {
              const { rounds } = data as { rounds: TRoundData[] };
              this.round[level] = rounds;
              // console.log(`Imported: Data (${data.rounds.length}) for level`, level + 1)
            }
            const len = this.round[level].length;
            if (page >= len) {
              resolve(this.round[level][len - 1]);
              return;
            }
            resolve(this.round[level][page]);
          });
      }
    });
  }

  change({ level, page }: { level?: number; page?: number }, callbacks?: TCallback[]) {
    if (level !== undefined && level !== this._state.level) page = 0;
    this._state = {
      level: level !== undefined ? level : this._state.level,
      page: page !== undefined ? page : this._state.page,
    };
    this.get().then(() => {
      if (callbacks) {
        callbacks.forEach(callback => callback());
      }
    });
  }
}

const puzzleData = new PuzzleData();
export default puzzleData;
