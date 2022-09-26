export type Abstract = {
  xmlPath: string;
  title: string;
  authors: Author[];
  htmlDom: string[];
};

export type Author = {
  surname: string;
  forenames: string;
};
