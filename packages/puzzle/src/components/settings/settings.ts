import { createElement } from '~/utils/dom';
import { getSettings, setSettings, type TSetting } from '~/api/settings/settings';
import puzzle from '~/game/controller/Puzzle';

import './styles.css';

const srcDark = './assets/moon.svg';
const srcLight = './assets/sun.svg';

const icons: Record<TSetting, string> = {
  picture: './assets/picture.svg',
  sound: './assets/sound.svg',
  translation: './assets/translation.svg',
  dark: srcDark,
};

const settings: TSetting[] = ['sound', 'picture', 'translation', 'dark'];

class Settings {
  private _el: HTMLElement;

  private _options: Record<TSetting, HTMLElement | null> = {
    sound: null,
    picture: null,
    translation: null,
    dark: null,
  };

  constructor() {
    this._el = this.getSettingsMenu();
  }

  public get el() {
    return this._el;
  }

  public refresh() {
    const data = getSettings();
    settings.forEach((name) => {
      this._options[name]?.classList.toggle('active', data[name]);
    });
    this._el.classList.remove('hidden');
  }

  private switchHandler = (event: Event) => {
    const el = event.currentTarget as HTMLLIElement;
    const option = el.dataset.option as TSetting;
    if (el && option) {
      const enabled = !el.classList.contains('active');
      el.classList.toggle('active', enabled);
      const prev = getSettings();
      setSettings({ ...prev, [option]: enabled });
      puzzle.setSetting(option, enabled);

      if (option === 'dark') {
        const icon = el.firstChild as HTMLImageElement;
        icon.src = enabled ? srcDark : srcLight;
        document.documentElement.classList.toggle('dark', enabled);
      }
    }
  };

  private getSettingsMenu = () => {
    const data = getSettings();

    const container = createElement('ul', { className: 'settings' });
    settings.forEach((name) => {
      const active = data[name] ? ' active' : '';
      const li = createElement('li', {
        className: `settings__item${active}`,
        onClick: this.switchHandler.bind(this),
      });
      li.dataset.option = name;
      const icon = createElement('img', { className: 'settings__icon', src: icons[name] });
      li.append(icon);
      this._options[name] = li;
      container.append(li);
    });

    return container;
  };
}

const settingsMenu = new Settings();
export default settingsMenu;
