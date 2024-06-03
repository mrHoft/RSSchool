import store from '~/utils/Store';

export type TProgressField = 'level' | 'round' | 'level_completed' | 'round_completed';
const fields: TProgressField[] = ['level', 'round'];
const defaultProgress = {
  level: 0,
  round: -1,
  level_completed: '',
  round_completed: '',
};

export type TProgress = {
  level: number;
  round: number;
  level_completed: string;
  round_completed: string;
};

export function getProgress(): TProgress {
  const progress = store.get('progress');
  if (progress && fields.every((field) => Object.prototype.hasOwnProperty.call(progress, field))) {
    return progress as TProgress;
  }
  return { ...defaultProgress };
}

export function setProgress(data: TProgress) {
  if (!data || fields.some((field) => !Object.prototype.hasOwnProperty.call(data, field))) {
    throw new Error('Progress data is incorrect.');
  }
  store.set('progress', data);
}

export function clearProgress() {
  store.set('progress', undefined);
}
