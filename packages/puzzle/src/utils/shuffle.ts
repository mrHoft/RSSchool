function shuffle<T>(data: T[]) {
  const array = Array.from(data);
  let currentIndex = array.length;
  let randomIndex = 0;

  while (currentIndex > 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
}

export default shuffle;
