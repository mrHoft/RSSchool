import socket from '~/api/ws/socket';
import { TUser } from '~/api/ws/types';
import EventBus from '~/services/eventbus';
import sanitize from '~/utils/sanitize';
import makeLink from './link/makeLink';
import MessageBoxView from './view';

class MessageBox extends MessageBoxView {
  private _recipient: TUser | null = null;
  private _edit: string | null = null;

  constructor() {
    super();
    this.$btnSend.addEventListener('click', this.sendHandler);
    this.$box.addEventListener('keyup', this.enterHandler);
  }

  public edit = (id: string, text: string) => {
    this._edit = id;
    this.$box.replaceChildren(text);
    this.$box.focus();
  };

  public setChangeCallback = (eventBus: EventBus) => {
    eventBus.on('recipient', this.recipientChange);
    this.$btnSend.disabled = true;
    this.$box.classList.add('disabled');
    this.$box.removeAttribute('contentEditable');
  };

  private recipientChange = (recipient: TUser) => {
    if (recipient) {
      this._recipient = recipient;
      this.$btnSend.disabled = false;
      this.$box.classList.remove('disabled');
      this.$box.contentEditable = 'true';
      this.$box.focus();
    }
  };

  private sendHandler = () => {
    const value = this.$box.innerHTML;
    const text = sanitize(value);
    if (text.length) {
      if (this._edit) {
        socket.editMessage(this._edit, text);
        this._edit = null;
      } else if (this._recipient) {
        socket.sendMessage(this._recipient.login, text);
        socket.markAllRead(this._recipient);
      }
      this.$box.replaceChildren();
      this.changeHeight('');
      this.$box.focus();
    }
  };

  private changeHeight(text: string) {
    const rows = text === '' ? 0 : text.split('<br>').length;
    const height = Math.max(Math.min(rows + 1, 5), 1) * 20 + 28;
    this.$el.style.height = `${height}px`;
  }

  private makeLinkCallback(selectedText: string) {
    return (link: string) => {
      let text = this.$box.innerHTML;
      const match = text.match(selectedText);
      if (match && match.index !== undefined) {
        text = `${text.slice(0, match.index)}[${selectedText}](${link})${text.slice(match.index + selectedText.length)}`;
        this.$box.innerHTML = text;
      }
    };
  }

  private enterHandler = (event: KeyboardEvent) => {
    if (event.altKey) {
      const selection = window.getSelection();
      if (selection) {
        if (event.key === 'k') {
          makeLink(this.makeLinkCallback(selection.toString()));
        }
      }
    } else if (event.key === 'Enter' || event.key === 'Backspace' || event.key === 'Delete') {
      let text = this.$box.innerHTML;
      if (text) {
        text.trim();
        if (event.key === 'Enter' || event.key === 'Backspace') {
          text = text.replace(/<\/?div>/gi, '');
          while (text.endsWith('<br>')) text = text.slice(0, -4);
        }
        if (!event.shiftKey && event.key === 'Enter') {
          this.sendHandler();
          text = '';
        }
        this.changeHeight(text);
      }
    }
  };
}

const messageBox = new MessageBox();
export default messageBox;
