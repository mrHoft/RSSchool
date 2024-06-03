const animationEnd = (event: Event) => {
  const card = event.currentTarget as HTMLDivElement;
  card.classList.remove('fly');
  card.removeEventListener('animationend', animationEnd, true);
};

export default function flyCard(card: HTMLElement, newParent: HTMLElement, delay = false) {
  const { top: fromTop, left: fromLeft } = card.getBoundingClientRect();
  card.classList.add('fly');
  newParent.append(card);

  setTimeout(() => {
    const { top, left } = card.getBoundingClientRect();

    card.style.setProperty(
      '--fly',
      `${(fromLeft - left).toFixed(2)}px, ${(fromTop - top).toFixed(2)}px`,
    );
    if (delay) {
      card.style.setProperty('--delay', `${(Math.random() * 0.5).toFixed(2)}s`);
    }
    card.addEventListener('animationend', animationEnd, true);
  }, 0);
}
