const request = require("async-request");
const fs = require("fs");
const path = require("path");
const shell = require("shelljs");
var tmp = require("tmp");
var quickGist = require("quick-gist");
const chalk = require("chalk");

const urls = {
  searchFoxUrl: "https://searchfox.org/mozilla-central/source/",
  mcRawUrl: "https://raw.githubusercontent.com/mozilla/gecko/central/",
  ghMCUrl:
    "https://github.com/devtools-html/devtools-core/blob/master/packages/",
  ghCoreUrl: "https://github.com/mozilla/gecko/blob/central",
  coreHistory:
    "https://github.com/devtools-html/devtools-core/commits/master/packages",
  mcHistory: "https://github.com/mozilla/gecko/commits/central"
};
async function gist(src, diff) {
  return new Promise(resolve => {
    quickGist(
      {
        content: diff,
        description: `${src} diff`,
        public: true,
        enterpriseOnly: false,
        fileExtension: "diff"
      },
      function(err, resp, data) {
        resolve(data.html_url);
      }
    );
  });
}

function diffText(oldText, newText) {
  var textFile = tmp.fileSync();
  var newTextFile = tmp.fileSync();

  fs.writeFileSync(textFile.name, oldText);
  fs.writeFileSync(newTextFile.name, newText);

  const out = shell.exec(`diff ${textFile.name} ${newTextFile.name}`, {
    silent: true
  });

  return out.stdout;
}

async function checkFile({ src, mc }, { issue }) {
  response = await request(`${urls.mcRawUrl}/${mc}`);

  const text = response.body;
  const newText = fs.readFileSync(
    path.join(__dirname, "../packages/", src),
    "utf8"
  );
  const diff = diffText(text, newText);

  if (diff !== "") {
    const diffUrl = await gist(src, diff);
    console.log(chalk.yellow(`Oops, ${src} has changed.`));

    if (issue) {
      const issueText = createIssue(src, mc, diffUrl);
      console.log(`----\n${issueText}\n\n----\n`);
    }
  }
}

function createIssue(src, mc, diffUrl) {
  const filename = path.basename(src);
  const issue = `
  Looks like, \`${filename}\` has [diverged][diff] from MC :frowning:

  * [\`${mc}\`][mc] -- [history][mc-history] --  [searchFox][fox]
  * [\`${src}\`][core] -- [history][core-history]

  [core]:${urls.ghCoreUrl}/${src}
  [mc]:${urls.ghMCUrl}/${mc}
  [diff]:${diffUrl}
  [fox]:${urls.searchFoxUrl}/${mc}
  [core-history]:${urls.coreHistory}/${src}
  [mc-history]:${urls.mcHistory}/${mc}
  `;

  const text = issue
    .split("\n")
    .map(line => line.trim())
    .join("\n");

  return text;
}

const files = [
  {
    src: "devtools-components/src/tree.js",
    mc: "devtools/client/shared/components/tree.js"
  },
  {
    src: "devtools-modules/src/menu/index.js",
    mc: "devtools/client/framework/menu-item.js"
  },
  {
    src: "devtools-modules/src/menu/menu-item.js",
    mc: "devtools/client/framework/menu-item.js"
  },
  {
    src: "devtools-modules/src/utils/defer.js",
    mc: "devtools/shared/defer.js"
  },
  {
    src: "devtools-modules/src/utils/event-emitter.js",
    mc: "devtools/shared/event-emitter.js"
  },
  {
    src: "devtools-modules/src/utils/task.js",
    mc: "devtools/shared/task.js"
  }
];

function checkFiles(files, options) {
  files.forEach(file => checkFile(file, options));
}

checkFiles(files, { issue: true });
