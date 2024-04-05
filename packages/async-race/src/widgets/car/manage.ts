import ColorPicker from '@/color/picker';
import { createCar, updateCar } from '~/api/garage';
import message from '@/message/message';
import ManageCarView from './view';
import getRandomCar from './random';
import validateName from '~/utils/validate';

import styles from './styles.module.css';

type TMode = 'create' | 'update';
const buttonText: Record<TMode, string> = {
  create: 'Create',
  update: 'Update',
};

class ManageCar extends ManageCarView {
  private _timeout: number | undefined;
  private _color = '#FFF';
  private _mode: TMode = 'create';
  private _id = 0;
  private _createCallback: (() => void) | null = null;
  private _updateCallback: (() => void) | null = null;
  private _picker: ColorPicker;

  constructor() {
    super();
    this.$colorInput.addEventListener('click', this.colorPickerShow);
    this.$colorBtn.addEventListener('mouseleave', this.colorPickerHide);
    this._picker = new ColorPicker({ color: this._color, callback: this.colorSelect });
    this.$colorBtn.append(this._picker.el);
    this.$rndBtn.addEventListener('click', this.randomClickHandler);
    this.$addBtn.addEventListener('click', this.submitClickHandler);
    this.$addBtn.textContent = buttonText[this._mode];
  }

  public get value() {
    return { name: this.$name.value, color: this._color };
  }

  public setCreateCallback(createCallback: () => void) {
    this._createCallback = createCallback;
  }

  public setUpdate(
    updateCallback: () => void,
    id: number,
    index: number,
    color: string,
    name: string,
  ) {
    this._updateCallback = updateCallback;
    this._mode = 'update';
    this._id = id;
    this.$addBtn.textContent = buttonText[this._mode];
    this.setCar(index + 1);
    this.colorSelect(color);
    this.$name.value = name;
  }

  private randomClickHandler = () => {
    getRandomCar().then(data => {
      this.$name.value = data.name;
      this._color = data.color;
      this._picker.setColor(this._color);
    });
  };

  private submitClickHandler = () => {
    const validate = validateName(this.$name.value);
    if (validate !== 'valid') {
      message.show(validate, 'error');
      return;
    }
    if (this._mode === 'update') {
      this._mode = 'create';
      this.$addBtn.textContent = buttonText[this._mode];
      updateCar(this._id, this.value).then(response => {
        if (typeof response === 'string') {
          message.show(response, 'error');
          return;
        }
        if (this._updateCallback) this._updateCallback();
        message.show(`Car ${this.$name.value} was successfuly updated!`);
        this.colorSelect('#FFF');
        this.$name.value = '';
        this.setCar(1);
      });
      return;
    }

    createCar().then(createResponse => {
      if (typeof createResponse === 'string') {
        message.show(createResponse, 'error');
        return;
      }
      updateCar(createResponse.id, this.value).then(updateResponse => {
        if (typeof updateResponse === 'string') {
          message.show(updateResponse, 'error');
          return;
        }
        if (this._createCallback) this._createCallback();
        message.show(`Car ${this.$name.value} was successfuly created!`);
        this.colorSelect('#FFF');
        this.$name.value = '';
      });
    });
  };

  private colorPickerShow = (event: MouseEvent) => {
    if (event.target === event.currentTarget) {
      const animationend = () => {
        this.$colorBtn.removeEventListener('animationend', animationend);
        this.$colorBtn.classList.remove(styles.editor__color_picker_show);
      };
      this.$colorBtn.classList.remove('hidden');
      this.$colorBtn.classList.add(styles.editor__color_picker_show);
      this.$colorBtn.addEventListener('animationend', animationend);
      this._timeout = undefined;
    }
  };

  private colorPickerHide = () => {
    if (this._timeout) return;
    const hide = () => {
      const animationend = () => {
        this.$colorBtn.removeEventListener('animationend', animationend);
        this.$colorBtn.classList.add('hidden');
        this.$colorBtn.classList.remove(styles.editor__color_picker_hide);
      };
      this.$colorBtn.classList.add(styles.editor__color_picker_hide);
      this.$colorBtn.addEventListener('animationend', animationend);
      this._timeout = undefined;
    };
    this._timeout = window.setTimeout(hide, 500);
  };

  private colorSelect = (hexString: string) => {
    this.$colorInput.style.backgroundColor = hexString;
    this.$carSvg.style.fill = hexString;
    this._color = hexString;
  };
}

const manageCar = new ManageCar();
export default manageCar;
