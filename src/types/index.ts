export type ServantBriefObj = {
  id: number;
  star: number;
  name_cn: string;
  name_jp: string;
  name_en: string;
  name_link: string;
  name_other: string | 0;
  cost: number | null;
  faction: string;
  get: string;
  hp: number | null;
  atk: number | null;
  class_link: string;
  avatar: string;
  card1: string;
  card2: string;
  card3: string;
  card4: string;
  card5: string;
  np_card: string;
  np_type: string;
  class_icon: string;
  stars_marker: number;
  class_marker: number;
  get_marker: number;
  cards_marker: number;
  npc_marker: number;
  npt_marker: number;
  fac_marker: number;
  sex_marker: number;
  prop1_marker: number;
  prop2_marker: number;
  traits_marker: number;
  sort_atk: number;
  sort_hp: number;
  tag?: string;
};
export type ImageItem = {
  url: string;
  type: string;
  localPath?: string;
  saveName?: string;
};

type NonUndefined<A> = A extends undefined ? never : A;

export type Keys<T, U> = NonUndefined<
  {
    [K in keyof T]-?: T[K] extends U ? K : never;
  }[keyof T]
>;
