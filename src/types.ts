export type Abstract = {
  xmlPath: string;
  authors: Author[];
  htmlDom: string[];
};

export type Author = {
  surname: string;
  forenames: string;
};
