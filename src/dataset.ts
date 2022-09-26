import fs from "fs";
import path from "path";

import { JSDOM } from "jsdom";
import CETEI from "CETEIcean";

import type { Abstract, Author } from "./types";

const documentsBasePath = "src/abstracts-xml/";

const CETEIcean = new CETEI();

const throwExpression = (errorMessage: string): never => {
  throw new Error(errorMessage);
};

const getTitle = (xmlDoc: Document): string =>
  // Unclear why `.querySelector("titleStmt title")` doesn't work, tbh...
  xmlDoc.querySelector("titleStmt")!.querySelector("title")?.textContent ??
  throwExpression("Missing title!");

const getAuthors = (xmlDoc: Document): Author[] =>
  // Unclear why `.querySelector("titleStmt author")` doesn't work, tbh...
  [...xmlDoc.querySelector("titleStmt")!.querySelectorAll("author")].map(
    (author) => ({
      surname:
        author.querySelector("name surname")?.textContent ??
        throwExpression("Author without surname!"),
      forenames: [...author.querySelectorAll("name forename")]
        .map((name) => name.textContent)
        .join(" "),
    }),
  );

const abstracts: Abstract[] = fs
  .readdirSync(documentsBasePath)
  .map((abstractPath, i, arr): Abstract => {
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    process.stdout.write(`Processing abstract ${i + 1} / ${arr.length}...`);

    const xmlString = fs.readFileSync(
      path.join(documentsBasePath, abstractPath),
      "utf-8",
    );
    const dom = new JSDOM(xmlString, { contentType: "text/xml" });
    const xmlDoc = dom.window.document;
    const htmlDom = CETEIcean.domToHTML5(xmlDoc);

    return {
      xmlPath: abstractPath,
      title: getTitle(xmlDoc),
      authors: getAuthors(xmlDoc),
      htmlDom,
    };
  });
process.stdout.write(" done!\n");

// Get a Map() of arrays of abstract keyed by the first letter of each author's
//  surname (abstracts are added to the arrays corresponding to all authors)
process.stdout.write("Generating `abstractsByAuthorInitial`...");
const abstractsByAuthorInitial = abstracts.reduce(
  (byAuthor: Map<string, Array<Abstract>>, abstract: Abstract) => {
    abstract.authors.forEach(({ surname }: { surname: string }) =>
      byAuthor.set(surname[0], [...(byAuthor.get(surname[0]) || []), abstract]),
    );
    return byAuthor;
  },
  new Map(),
);
process.stdout.write(" done!\n");

export { abstracts, abstractsByAuthorInitial };
