import { createElement } from './dom';

type TPart = {
  text: string;
  id?: string;
  url?: string;
};

function checkLink(text: string) {
  const arr: TPart[] = [];
  function checker(str: string) {
    const match = str.match(/\[([\w\s\d-]+)\]\((https?:\/\/[\w\d./?=#@-]+)\)/);
    if (match && match.index) {
      const id = match[1];
      const url = match[2];
      arr.push({ text: str.slice(0, match.index), id, url });
      checker(str.substring(match.index + id.length + url.length + 4));
    } else if (arr.length) arr.push({ text: str });
  }
  checker(text);
  return arr.length ? arr : null;
}

function parseLine(line: string) {
  if (!line.length) return null;

  if (line.startsWith('# ')) {
    const h = createElement('h1', { textContent: line.substring(2) });
    return h;
  }
  if (line.startsWith('## ')) {
    const h = createElement('h2', { textContent: line.substring(3) });
    return h;
  }
  if (line.startsWith('### ')) {
    const h = createElement('h3', { textContent: line.substring(4) });
    return h;
  }

  const links = checkLink(line);
  if (links) {
    const p = document.createElement('p');
    links.forEach(({ text, id, url }) => {
      p.append(document.createTextNode(text));
      if (id) {
        const a = createElement('a', { textContent: id, href: url });
        p.append(a);
      }
    });
    return p;
  }

  const p = document.createElement('p');
  p.textContent = line;
  return p;
}

export default function parse(text: string) {
  const data = text.split('\n');
  const fragment = document.createDocumentFragment();
  data.forEach(line => {
    const el = parseLine(line);
    if (el) fragment.append(el);
  });
  return fragment;
}
