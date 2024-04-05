import getRandomCarName from './brand';
import getRandomColor from './color';

export default function getRandomCar() {
  const color = getRandomColor();
  return getRandomCarName().then(name => ({ name, color }));
}
