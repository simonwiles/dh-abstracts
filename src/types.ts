export type Abstract = {
  xmlPath: string;
  type: string;
  title: string;
  authors: Author[];
  conference: string;
  year: number;
  keywords: string[];
  htmlDom: string[];
};

export type Author = {
  surname: string;
  forenames: string;
};
