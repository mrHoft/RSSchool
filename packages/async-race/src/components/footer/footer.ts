import { createElement } from '~/utils/dom';
import './styles.css';

const Footer = () => {
  const footer = createElement('footer', { className: 'footer' });

  const author = createElement('div', { className: 'footer__author' });
  const copyright = createElement('span', {
    className: 'footer__author_copy',
    textContent: '© 2024',
  });
  const avatar = createElement('img', {
    className: 'footer__author_avatar',
    src: './icons/ranjy_96.png',
  });
  const link = createElement('a', { textContent: 'mrHoft', href: 'https://github.com/mrHoft' });
  author.append(copyright, avatar, link);

  const rss = createElement('a', { className: 'footer__logo_rss', href: 'https://rs.school/' });

  footer.append(author, rss);
  return footer;
};

export default Footer;
