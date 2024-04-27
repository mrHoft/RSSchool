import EventBus from '~/services/eventbus';

export default class ChatModel {
  protected _disconnected = false;
  protected eventBus = new EventBus();
}
