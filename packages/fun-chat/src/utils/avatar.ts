const COUNT = 24;

const defaultAvatar = './icons/user.svg';

export default function getAvatar(name: string) {
  if (!name || typeof name !== 'string') return defaultAvatar;
  if (name === 'Hoft') return './icons/ranjy_60.png';
  if (name.startsWith('Froggy')) return './avatar/froggy.png';
  const match = name.match(/\d+/);
  const val = match ? Number(match[0]) : name.charCodeAt(0) + name.charCodeAt(1);
  return `./avatar/${`0${(val % COUNT) + 1}`.slice(-2)}.webp`;
}
