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

const getType = (xmlDoc: Document): string =>
  xmlDoc.documentElement.getAttribute("rend") ??
  throwExpression("Missing title!");

// In the following functions the calls to querySelector are chained
//  because combining them (e.g. `.querySelector("titleStmt title")`)
//  doesn't work -- not 100% clear why, tbh... :shrug:
const getTitle = (xmlDoc: Document): string =>
  xmlDoc.querySelector("titleStmt")!.querySelector("title")?.textContent ??
  throwExpression("Missing title!");

const getAuthors = (xmlDoc: Document): Author[] =>
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

const getConference = (xmlDoc: Document): string =>
  xmlDoc.querySelector("seriesStmt")!.querySelector("title")?.textContent ??
  throwExpression("Missing conference title!");

const getYear = (xmlDoc: Document): number =>
  Number(
    xmlDoc.querySelector("publicationStmt")!.querySelector("date")?.textContent,
  ) ?? throwExpression("Missing date!");

const getKeywords = (xmlDoc: Document): string[] =>
  [
    ...xmlDoc
      .querySelector("profileDesc")!
      .querySelectorAll("keywords list item"),
  ]
    .map(
      (keyword) =>
        keyword.textContent?.trim() ??
        throwExpression("keyword missing content!"),
    )
    .filter((keyword) => keyword);

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
      type: getType(xmlDoc),
      title: getTitle(xmlDoc),
      authors: getAuthors(xmlDoc),
      conference: getConference(xmlDoc),
      year: getYear(xmlDoc),
      keywords: getKeywords(xmlDoc),
      htmlDom,
    };
  });
process.stdout.write(" done!\n");

// Get a Map() of Set()s of abstract keyed by the first letter of each author's
//  surname (abstracts are added to the Set()s corresponding to all authors)
process.stdout.write("Generating `abstractsByAuthorInitial`...");
const abstractsByAuthorInitial = abstracts.reduce(
  (byAuthor: Map<string, Set<Abstract>>, abstract: Abstract) => {
    abstract.authors.forEach(({ surname }: { surname: string }) =>
      byAuthor.set(
        surname[0],
        byAuthor.get(surname[0])?.add(abstract) || new Set([abstract]),
      ),
    );
    return byAuthor;
  },
  new Map(),
);
process.stdout.write(" done!\n");

// Get a Map() of Set()s of abstract keyed by the abstract type
process.stdout.write("Generating `abstractsByType`...");
const abstractsByType = abstracts.reduce(
  (byType: Map<string, Set<Abstract>>, abstract: Abstract) => {
    byType.set(
      abstract.type,
      byType.get(abstract.type)?.add(abstract) || new Set([abstract]),
    );
    return byType;
  },
  new Map(),
);
process.stdout.write(" done!\n");

// Get a Map() of Set()s of abstract keyed by year
process.stdout.write("Generating `abstractsByYear`...");
const abstractsByYear = abstracts.reduce(
  (byYear: Map<string, Set<Abstract>>, abstract: Abstract) => {
    byYear.set(
      String(abstract.year),
      byYear.get(String(abstract.year))?.add(abstract) || new Set([abstract]),
    );
    return byYear;
  },
  new Map(),
);
process.stdout.write(" done!\n");

export {
  abstracts,
  abstractsByAuthorInitial,
  abstractsByType,
  abstractsByYear,
};
