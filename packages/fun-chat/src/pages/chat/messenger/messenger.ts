import { TUser } from '~/api/ws/types';
import EventBus from '~/services/eventbus';
import state from '~/services/state';
import messageBox from '~/widgets/enter/enter';
import MessagesView from './view';

export default class Messages extends MessagesView {
  constructor(eventBus: EventBus) {
    super(eventBus);
    state.on(state.EVENT_UPDATE, this.updateMessages);
    messageBox.setChangeCallback(eventBus);
  }

  public updateMessages = (field: string = 'messages') => {
    if (field === 'user') {
      const user = state.get('user');
      if (user) {
        this._user = <TUser>user;
      }
    }
  };
}
