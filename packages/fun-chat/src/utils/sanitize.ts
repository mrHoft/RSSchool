export default function sanitize(text: string) {
  return text
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&nbsp;', ' ')
    .replace(/<\/?div>/gi, '')
    .replaceAll('<br><br>', '<br>')
    .replaceAll('<b><br></b>', '')
    .replaceAll('<i><br></i>', '')
    .replaceAll('<u><br></u>', '')
    .replace(/<\s*script\s*>.*<\/\s*script\s*>/gi, '')
    .replace(/alert\s*\([^)]*\)/gi, '')
    .replace(/<\/?span[^>]*>/gi, '')
    .replaceAll(' ', ' ')
    .replaceAll('<br>', '\n')
    .replaceAll(' \n', '\n')
    .trim();
}
