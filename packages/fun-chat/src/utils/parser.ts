/** Markdown parcer by @mrHoft
 * Supports:
 * # h1
 * ## h2
 * ### h3
 * unnamed list
 * <img>
 * <b>, <i>, <u>
 * [link](url)
 */

import { createElement } from './dom';

type TLinkParts = {
  str: string;
  id?: string;
  url?: string;
};

function checkLink(text: string) {
  const arr: TLinkParts[] = [];
  function checker(str: string) {
    const match = str.match(/\[([\w\s\d-]+)\]\(([https?://]*[\w\d./?=#@-]+)\)/);
    if (match && match.index !== undefined) {
      const id = match[1];
      const url = match[2];
      arr.push({ str: str.slice(0, match.index), id, url });
      checker(str.substring(match.index + id.length + url.length + 4));
    } else if (arr.length) arr.push({ str });
  }
  checker(text);

  const res: (HTMLElement | Text)[] = [];
  if (arr.length) {
    arr.forEach(({ str, id, url }) => {
      res.push(document.createTextNode(str));
      if (id && url) {
        const a = document.createElement('a');
        a.textContent = id;
        a.href = url;
        a.target = '_blank';
        res.push(a);
      }
    });
  }
  return res;
}

function splitText(text: string) {
  function split(str: string): string[] {
    const match = str.match(/<[^>]+>[^<]*<\/[^>]+>/);
    if (match && match.index !== undefined) {
      return [
        str.slice(0, match.index),
        match[0],
        ...split(str.slice(match.index + match[0].length)),
      ];
    }
    return [str];
  }
  return split(text);
}

function checkTransforms(text: string) {
  const tags = ['<img>', '<b>', '<i>', '<u>'];
  const parts = splitText(text);

  const res: (HTMLElement | Text)[] = [];
  parts.forEach(str => {
    let added = false;
    for (let i = 0; i < tags.length; i += 1) {
      const tag = tags[i];
      if (str.startsWith(tag.slice(0, tag.length - 1))) {
        const tagName = tag.slice(1, -1);
        const el = document.createElement(tagName);
        el.textContent = str.slice(str.indexOf('>') + 1, -tag.length - 1);
        res.push(el);
        if (tagName === 'img') {
          const img = el as HTMLImageElement;
          const match = str.match(/src\s*=\s*"([^"]+)"/);
          if (match) img.src = match[1];
          img.alt = '';
        }
        added = true;
        break;
      }
    }
    if (!added) {
      let regular = str;
      if (str.startsWith('<')) {
        const tagEnd = str.indexOf('>') + 1;
        regular = str.slice(tagEnd, -tagEnd - 1);
      }
      const linkNodes = checkLink(regular);
      if (linkNodes.length) res.push(...linkNodes);
      else res.push(document.createTextNode(regular));
    }
  });

  return res;
}

class Parser {
  private ulElements: HTMLLIElement[] = [];

  public parseLine(line: string | null) {
    const res: (HTMLElement | Text)[] = [];

    if (line && line.trimStart().startsWith('- ')) {
      this.ulElements.push(
        createElement<HTMLLIElement>('li', { textContent: line.slice(2).trimStart() }),
      );
      return res;
    }

    if (this.ulElements.length) {
      const ul = document.createElement('ul');
      ul.append(...this.ulElements);
      this.ulElements = [];
      res.push(ul);
    }

    if (line === null) return res;

    const str = line.trim();

    if (!str.length) {
      res.push(document.createElement('br'));
      return res;
    }

    if (str.startsWith('# ')) {
      res.push(createElement('h1', { textContent: str.substring(2) }));
      return res;
    }
    if (str.startsWith('## ')) {
      res.push(createElement('h2', { textContent: str.substring(3) }));
      return res;
    }
    if (str.startsWith('### ')) {
      res.push(createElement('h3', { textContent: str.substring(4) }));
      return res;
    }

    const nodes = checkTransforms(str);
    if (nodes.length) {
      const p = document.createElement('p');
      p.append(...nodes);
      res.push(p);
      return res;
    }

    res.push(createElement('p', { textContent: str }));
    return res;
  }
}

export default function parse(text: string) {
  const parser = new Parser();
  const data = text.trimEnd().split('\n');
  const fragment = document.createDocumentFragment();
  data.forEach(line => {
    fragment.append(...parser.parseLine(line));
  });
  fragment.append(...parser.parseLine(null));
  return fragment;
}
