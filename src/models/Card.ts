export type Card = {
  id: string;
  title: string;
  content: string;
  html?: string;
  links?: Link[];
};

export type Link = {
  id: string;
};
