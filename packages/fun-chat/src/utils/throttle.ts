type TFunc = (...args: unknown[]) => void;

export function throttle(func: TFunc, delay = 1000) {
  let timerFlag = 0;

  return (...args: unknown[]) => {
    if (timerFlag === 0) {
      func(...args);
      timerFlag = window.setTimeout(() => {
        timerFlag = 0;
      }, delay);
    }
  };
}

export function debounce<T>(func: (arg: T) => void, delay = 100) {
  let timer = 0;
  let lastArg: unknown = null;

  return (arg: T) => {
    clearTimeout(timer);
    if (arg === lastArg) {
      timer = window.setTimeout(() => {
        func(arg);
      }, delay);
    } else {
      lastArg = arg;
      func(arg);
    }
  };
}
