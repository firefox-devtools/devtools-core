// import SourceEditor from "../src/source-editor";
const SourceEditor = require("../src/source-editor")

require("devtools-launchpad/src/lib/themes/light-theme.css")

function createEditor(){
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
  const todomvc = "http://todomvc.com/examples/backbone/js/views/todo-view.js"
  fetch(todomvc).then(r => r.text()).then(v => editor.setText(v))
}



window.onload = function() {
  const editor = createEditor();
  editor._initShortcuts = () => {};

  editor.appendToLocalElement(document.querySelector(".editor-mount"));
  getText(editor)
  editor.setMode({ name: "javascript" })

  document.body.parentNode.classList.add("theme-light")
  window.editor = editor;
}
