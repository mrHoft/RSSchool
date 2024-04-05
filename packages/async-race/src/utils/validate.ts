export default function validateName(name: string) {
  if (name.length < 4) {
    return 'Car name length must be more than 3 symbols.';
  }
  if (name.charAt(0) !== name.charAt(0).toUpperCase()) {
    return 'Car name must starts from the capital leter.';
  }
  return 'valid';
}
