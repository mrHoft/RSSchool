import { getSettings } from '~/api/settings/settings';
import EventBus from '~/services/eventbus';
import { eventBusTheme } from '~/ui/theme/theme';
import SearchView from './view';

export default class Search extends SearchView {
  private eventBus: EventBus;

  constructor(eventBus: EventBus) {
    super();
    this.eventBus = eventBus;
    const { dark } = getSettings();
    this.themeUpdate(dark);
    eventBusTheme.on('theme', this.themeUpdate);
    this.$btnClear.addEventListener('click', this.clearField);
    this.$field.addEventListener('input', this.editField);
  }

  private editField = () => {
    this.$btnClear.classList.toggle('hidden', !this.$field.value.length);
    const regExp = new RegExp(this.$field.value);
    this.eventBus.emit('search', regExp);
  };

  private clearField = (event: Event) => {
    event.preventDefault();
    this.$btnClear.classList.add('hidden');
    this.$field.value = '';
    this.eventBus.emit('search', /(?:)/);
  };

  private themeUpdate = (dark: boolean) => {
    this.$imgClear.classList.toggle('invert', dark);
    this.$imgSubmit.classList.toggle('invert', !dark);
  };
}
