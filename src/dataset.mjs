import fs from "fs";
import path from "path";

import { JSDOM } from "jsdom";
import CETEI from "CETEIcean";

const documentsBasePath = "src/abstracts-xml/";

const CETEIcean = new CETEI();

const getAuthors = (xmlDom) =>
  // Unclear why `.querySelector("titleStmt author")` doesn't work, tbh...
  [...xmlDom.querySelector("titleStmt").querySelectorAll("author")].map(
    (author) => ({
      surname: author.querySelector("name surname").textContent,
      forenames: [...author.querySelectorAll("name forename")]
        .map((name) => name.textContent)
        .join(" "),
    }),
  );

const abstracts = fs
  .readdirSync(documentsBasePath)
  .map((abstractPath, i, arr) => {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(`Processing abstract ${i + 1} / ${arr.length}`);

    const xmlString = fs.readFileSync(
      path.join(documentsBasePath, abstractPath),
      "utf-8",
    );
    const dom = new JSDOM(xmlString, { contentType: "text/xml" });
    const xmlDom = dom.window.document;
    const htmlDom = CETEIcean.domToHTML5(xmlDom);

    return {
      xmlPath: abstractPath,
      authors: getAuthors(xmlDom),
      htmlDom,
    };
  });
process.stdout.write("\n");

export { abstracts };

// If called as a node script, print abstracts to stdout.
// See `yarn print-dataset`
import { fileURLToPath } from "url";
const nodePath = path.resolve(process.argv[1]);
const modulePath = path.resolve(fileURLToPath(import.meta.url));
if (nodePath === modulePath) console.log(JSON.stringify(abstracts, null, 2));
