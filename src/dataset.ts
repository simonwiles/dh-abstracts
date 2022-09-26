import fs from "fs";
import path from "path";

import { JSDOM } from "jsdom";
import CETEI from "CETEIcean";

const documentsBasePath = "src/abstracts-xml/";

const CETEIcean = new CETEI();

const getAuthors = (xmlDoc: Document) =>
  // Unclear why `.querySelector("titleStmt author")` doesn't work, tbh...
  [...xmlDoc.querySelector("titleStmt")!.querySelectorAll("author")].map(
    (author) => ({
      surname: author.querySelector("name surname")?.textContent,
      forenames: [...author.querySelectorAll("name forename")]
        .map((name) => name.textContent)
        .join(" "),
    }),
  );

const abstracts = fs
  .readdirSync(documentsBasePath)
  .map((abstractPath, i, arr) => {
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    process.stdout.write(`Processing abstract ${i + 1} / ${arr.length}`);

    const xmlString = fs.readFileSync(
      path.join(documentsBasePath, abstractPath),
      "utf-8",
    );
    const dom = new JSDOM(xmlString, { contentType: "text/xml" });
    const xmlDoc = dom.window.document;
    const htmlDom = CETEIcean.domToHTML5(xmlDoc);

    return {
      xmlPath: abstractPath,
      authors: getAuthors(xmlDoc),
      htmlDom,
    };
  });
process.stdout.write("\n");

export { abstracts };
