import router from '~/utils/Router';
import { getUser, clearUser, type TUser } from '~/api/user/user';
import { clearSettings } from '~/api/settings/settings';
import { clearProgress } from '~/api/progress/progress';
import { createElement } from '~/utils/dom';

import './styles.css';

const srcLogin = './assets/login.svg';
const srcLogout = './assets/logout.svg';

function getInitials({ name, surname }: TUser) {
  return `${(name ?? '').charAt(0)}${(surname ?? '').charAt(0)}`;
}
const UserMenu = () => {
  const user = getUser();

  function LogOut() {
    clearUser();
    clearSettings();
    clearProgress();
    UserMenu();
    router.go('/');
  }

  const menu =
    document.getElementById('user') ??
    createElement('div', { className: 'user__menu', id: 'user' });
  menu.onclick = user ? LogOut : () => router.go('/login');
  menu.innerHTML = '';

  const icon = createElement('img', {
    className: user ? 'user__menu_icon opaque' : 'user__menu_icon',
    src: user ? srcLogout : srcLogin,
  });
  menu.append(icon);
  if (user) menu.append(getInitials(user));

  return menu;
};

export default UserMenu;
