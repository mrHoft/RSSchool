export type TCar = {
  name: string;
  color: string;
  id: number;
};

export type TGarage = {
  cars: TCar[];
  total: number;
};
