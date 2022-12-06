export type Card = {
  col: string;
  row: string;
  title: string;
  md: string;
  html: string;
  links?: Link[];
};

export type Link = {
  col: string;
  row: string;
};
