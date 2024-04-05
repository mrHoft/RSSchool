import store from '~/utils/Store';
import getSystemTheme from '~/utils/system';

const isDarkTheme = getSystemTheme() === 'dark';

export type TSetting = 'sound' | 'dark';
const fields: TSetting[] = ['sound', 'dark'];
const defaultSettings = {
  sound: true,
  picture: true,
  translation: true,
  dark: isDarkTheme,
};

export type TSettings = Record<TSetting, boolean>;

export function getSettings(): TSettings {
  const settings = store.get('settings');
  if (settings) {
    if (fields.every(field => Object.prototype.hasOwnProperty.call(settings, field))) {
      return settings as TSettings;
    }
    return { ...defaultSettings, ...settings };
  }
  return { ...defaultSettings };
}

export function setSettings(data?: TSettings) {
  if (!data || fields.some(field => !Object.prototype.hasOwnProperty.call(data, field))) {
    throw new Error('Settings data is incorrect.');
  }
  store.set('settings', data);
}

export function clearSettings() {
  store.set('settings', undefined);
}
