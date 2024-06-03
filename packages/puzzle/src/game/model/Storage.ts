export type TLevelData = {
  author: string;
  cutSrc: string;
  id: string;
  imageSrc: string;
  name: string;
  year: string;
};

export type TWord = {
  audioExample: string;
  id: number;
  textExample: string;
  textExampleTranslate: string;
  word: string;
  wordTranslate: string;
};

export type TRoundData = {
  levelData: TLevelData;
  words: TWord[];
};

interface RoundDataStore {
  round: TRoundData[][];
}

export default class DataStorage implements RoundDataStore {
  round: TRoundData[][] = [];
}
