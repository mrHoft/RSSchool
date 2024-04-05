export type TWinner = {
  id: number;
  wins: number;
  time: number;
};

export type TWinners = {
  winners: TWinner[];
  total: number;
};

export type TSort = 'id' | 'wins' | 'time';
export type TOrder = 'ASC' | 'DESC';
