type TStatus = {
  id: number;
  name: string;
  color: string;
  started: boolean;
  timestamp?: Date;
  timeline: number;
  velocity: number;
  distance: number;
  timer: number;
};
export type TControls = Record<'start' | 'stop' | 'edit' | 'del', HTMLButtonElement>;

export default class TrackModel {
  protected static TOTAL = 7;
  protected _status: TStatus[] = new Array<TStatus>(TrackModel.TOTAL);
  protected $car: HTMLElement[] = new Array<HTMLElement>(TrackModel.TOTAL);
  protected $ctrl: TControls[] = new Array<TControls>(TrackModel.TOTAL);
}
