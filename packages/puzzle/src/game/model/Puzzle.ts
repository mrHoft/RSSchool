type TGameValues = {
  level: number;
  page: number;
  rounds: number;
  line: number;
  skipped: number[];
  fullfilled: boolean;
  passed: boolean;
  image: string;
};

export default class PuzzleModel {
  private _game: TGameValues = {
    level: 0,
    page: 0,
    line: 0,
    skipped: [],
    fullfilled: false,
    passed: false,
    rounds: 0,
    image: '',
  };

  private _sentence: string[] = [];

  private _items: HTMLElement[] = [];

  protected elements: Record<string, HTMLElement | null> = {
    levelSelect: null,
    pageSelect: null,
    puzzleBody: null,
    imageInfo: null,
    sourceText: null,
    sourceBlock: null,
    autoComplete: null,
  };

  protected rows: HTMLDivElement[] = [];

  protected marks: HTMLDivElement[] = [];

  get game() {
    return this._game;
  }

  get sentence() {
    return this._sentence;
  }

  get items() {
    return this._items;
  }

  set items(data: HTMLElement[]) {
    this._items = data;
  }

  get levelSelect() {
    if (!this.elements.levelSelect) throw new Error('No levelSelect element');
    return this.elements.levelSelect;
  }

  get pageSelect() {
    if (!this.elements.pageSelect) throw new Error('No pageSelect element');
    return this.elements.pageSelect;
  }

  get puzzleBody() {
    if (!this.elements.puzzleBody) throw new Error('No puzzleBody element');
    return this.elements.puzzleBody;
  }

  get imageInfo() {
    if (!this.elements.imageInfo) throw new Error('No imageInfo element');
    return this.elements.imageInfo;
  }

  get sourceText() {
    if (!this.elements.sourceText) throw new Error('No sourceText element');
    return this.elements.sourceText;
  }

  get sourceBlock() {
    if (!this.elements.sourceBlock) throw new Error('No sourceBlock element');
    return this.elements.sourceBlock;
  }

  get autoComplete() {
    if (!this.elements.autoComplete) throw new Error('No autoComplete element');
    return this.elements.autoComplete;
  }
}
