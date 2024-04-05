type TCallback = (hexString: string) => void;

export default class ColorPickerModel {
  protected _widthUnits = 'px';
  protected _heightUnits = 'px';
  protected _huePosition = 0;
  protected _hueHeight = 0;
  protected _maxHue = 0;
  protected _saturationWidth = 0;
  protected _isChoosing = false;
  protected _callbacks: TCallback[] = [];
  protected _width = 175;
  protected _height = 175;
  protected _inputIsNumber = false;
}
