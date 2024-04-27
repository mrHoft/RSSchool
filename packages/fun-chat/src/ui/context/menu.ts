import socket from '~/api/ws/socket';
import messageBox from '~/widgets/enter/enter';
import ContextMenuView from './view';

class ContextMenu extends ContextMenuView {
  private _shown = false;
  private _messageId: string | null = null;
  private _messageText: string | null = null;

  constructor() {
    super();
    document.body.addEventListener('click', this.hideHandler);
    this.$items[0].addEventListener('click', this.editHandler);
    this.$items[1].addEventListener('click', this.deleteHandler);
  }

  private deleteHandler = () => {
    socket.deleteMessage(this._messageId!);
  };

  private editHandler = () => {
    if (this._messageId && this._messageText) {
      messageBox.edit(this._messageId, this._messageText);
    }
  };

  private hideHandler = () => {
    if (this._shown) {
      this.$el.classList.add('hidden');
      this._shown = false;
    }
  };

  public show(x: number, y: number, id: string, text: string) {
    this._messageId = id;
    this._messageText = text;
    const width = window.innerWidth;
    this.$el.style.top = `${y}px`;
    this.$el.style.left = `${Math.min(x, width - 120)}px`;
    this.$el.classList.remove('hidden');
    this._shown = true;
  }
}

const contextMenu = new ContextMenu();
export default contextMenu;
