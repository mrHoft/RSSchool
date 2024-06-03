const getSystemTheme = (): 'dark' | 'light' => {
  const dark =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches;

  return dark ? 'dark' : 'light';
};
export default getSystemTheme;
