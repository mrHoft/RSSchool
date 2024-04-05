export default function getRandomColor() {
  const rnd = () => (~~(Math.random() * 200) + 55).toString(16);
  return `#${Array.from({ length: 3 }, rnd).join('')}`;
}
