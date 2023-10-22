export function generateId() {
  return new Array(9)
    .fill()
    .map(() => (~~(Math.random() * 16)).toString(16).toUpperCase())
    .join('')
}
