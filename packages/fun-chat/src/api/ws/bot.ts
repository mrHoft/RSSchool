import { TMessage, TResponseType, TUser } from './types';

type TResponse = {
  id: string;
  type: TResponseType;
  payload: { message: TMessage; messages: TMessage[]; users: TUser[]; user: TUser };
};

const API_URL = (import.meta.env.VITE_API_URL as string) ?? 'ws://localhost:4000';

const NAME = 'Froggy (chat bot)';
const MSG = ['Sure', 'Great!', 'Right', 'Yup', 'Cool!', '*kwa*'];
const GREET = ['Hi!', 'Hello!', "What's up?"];
const WELCOME = ['Welcome back!', 'How are you?', '*kwa-kwa-kwa!*', '*kwa-kwa?*'];
const EXAMPLES = [
  `Hi there! I am Froggy, the chat bot.
<img src="./image/frog.svg" alt="frog"/>
I'll tell you about this chat.`,
  `You can add multiple lines by pressing SHIFT + Enter.

You can send <b>bold</b>, <i>italic</i> or <u>underlaned</u> text.
Just select text part and press CTRL + B/I/U.`,
  `You can use headers:
### Header 3 example
You can use markdown for this.`,
  `You can use lists:
- item 1
- item 2
- item 3
Simply start string form "dash" symbol.`,
  `Little images can be pasted from the clipboard:
<img src="data:image/png;base64,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" alt="">`,
  `And you can also make external links.
[Example](?page=about)
Use markdown or press ALT + K.`,
  'How are you, btw?',
];

function makeAnswear(text: string) {
  text = text.trimStart().toLowerCase();
  if (text.startsWith('hi') || text.startsWith('hello')) {
    return GREET[~~(Math.random() * GREET.length)];
  }
  return MSG[~~(Math.random() * MSG.length)];
}

class ChatBot {
  private s: WebSocket | null = null;

  public connect(url?: string) {
    if (this.s) this.s.close();
    this.s = new WebSocket(url ?? API_URL);
    this.s?.addEventListener('open', () => {
      this.s?.send(
        JSON.stringify({
          id: '1',
          type: 'USER_LOGIN',
          payload: { user: { id: '1', login: NAME, password: '123' } },
        }),
      );
    });
    this.s?.addEventListener('message', this.messageHaundler);
  }

  private tour = (to: string) => {
    EXAMPLES.forEach(text => {
      this.s?.send(
        JSON.stringify({ id: '3', type: 'MSG_SEND', payload: { message: { to, text } } }),
      );
    });
  };

  private get = (name: string) => {
    if (name !== NAME) {
      this.s?.send(
        JSON.stringify({
          id: `MSG_FROM_${name}`,
          type: 'MSG_FROM_USER',
          payload: { user: { login: name } },
        }),
      );
    }
  };

  private messageHaundler = ({ data }: { data: string }) => {
    const { id, type, payload } = <TResponse>JSON.parse(data);
    if (type === 'USER_LOGIN') {
      this.s?.send(JSON.stringify({ id: '2', type: 'USER_ACTIVE', payload: null }));
    }
    if (type === 'USER_EXTERNAL_LOGIN') {
      this.get(payload.user.login);
    }
    if (type === 'USER_ACTIVE') {
      payload.users.forEach(user => this.get(user.login));
    }
    if (type === 'MSG_FROM_USER') {
      const to = id.substring(9);
      if (!payload.messages.length) {
        this.tour(to);
      } else {
        this.s?.send(
          JSON.stringify({
            id: '3',
            type: 'MSG_SEND',
            payload: { message: { to, text: WELCOME[~~(Math.random() * WELCOME.length)] } },
          }),
        );
      }
    }
    if (type === 'MSG_SEND' && payload.message.from !== NAME) {
      this.s?.send(
        JSON.stringify({
          id: '4',
          type: 'MSG_READ',
          payload: { message: { id: payload.message.id } },
        }),
      );
      this.s?.send(
        JSON.stringify({
          id: '5',
          type: 'MSG_SEND',
          payload: {
            message: { to: payload.message.from, text: makeAnswear(payload.message.text) },
          },
        }),
      );
    }
  };
}

const chatBot = new ChatBot();
export default chatBot;
