const SourceEditor = require("../src/source-editor");

require("devtools-launchpad/src/lib/themes/light-theme.css");
require("devtools-launchpad/src/lib/themes/dark-theme.css");
require("devtools-launchpad/src/lib/themes/firebug-theme.css");
require("./index.css");
require("../src/source-editor.css");

const { clearLineClass } = require("../src/utils");

function createEditor() {
  const gutters = ["breakpoints", "hit-markers", "CodeMirror-linenumbers"];
  gutters.push("CodeMirror-foldgutter");

  return new SourceEditor({
    mode: "javascript",
    foldGutter: true,
    readOnly: true,
    lineNumbers: true,
    theme: "mozilla",
    lineWrapping: false,
    matchBrackets: true,
    showAnnotationRuler: true,
    gutters,
    value: " ",
    extraKeys: {
      // Override code mirror keymap to avoid conflicts with split console.
      Esc: false,
      "Cmd-F": false,
      "Cmd-G": false
    }
  });
}

function getText(editor) {
  const todomvc = "http://localhost:8002/assets/build/examples.js";
  fetch(todomvc).then(r => r.text()).then(v => editor.setText(v));
}

window.onload = function() {
  const editor = createEditor();
  editor._initShortcuts = () => {};

  editor.appendToLocalElement(document.querySelector(".editor-mount"));
  getText(editor);
  editor.setMode({ name: "javascript" });

  setTheme("light");
  window.editor = editor;
};

console.log("call addDebugLine(line) to add a debug line");
window.addDebugLine = function(line) {
  const cm = document.querySelector(".CodeMirror").CodeMirror;
  clearLineClass(cm, "debug-line");
  cm.addLineClass(line, "line", "debug-line");
};

console.log("call setTheme(theme) to set the theme");
window.setTheme = function(theme) {
  const root = document.body.parentNode;
  const bod = document.body;

  root.className = "";
  bod.className = "";

  root.classList.add(`theme-${theme}`);
  bod.classList.add(`theme-${theme}`);
};
