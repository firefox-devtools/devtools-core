/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const { shallow } = require("enzyme");
const { REPS } = require("../rep");
const { Rep } = REPS;

const testCases = [{
  name: "testMultiline",
  props: {
    object: "aaaaaaaaaaaaaaaaaaaaa\nbbbbbbbbbbbbbbbbbbb\ncccccccccccccccc\n",
  },
  result: "\"aaaaaaaaaaaaaaaaaaaaa\\nbbbbbbbbbbbbbbbbbbb\\ncccccccccccccccc\\n\""
}, {
  name: "testMultilineLimit",
  props: {
    object: "aaaaaaaaaaaaaaaaaaaaa\nbbbbbbbbbbbbbbbbbbb\ncccccccccccccccc\n",
    cropLimit: 20
  },
  result: "\"aaaaaaaaa…cccccc\\n\""
}, {
  name: "testMultilineOpen",
  props: {
    object: "aaaaaaaaaaaaaaaaaaaaa\nbbbbbbbbbbbbbbbbbbb\ncccccccccccccccc\n",
    member: { open: true }
  },
  result: "\"aaaaaaaaaaaaaaaaaaaaa\\nbbbbbbbbbbbbbbbbbbb\\ncccccccccccccccc\\n\""
}, {
  name: "testUseQuotes",
  props: {
    object: "abc",
    useQuotes: false
  },
  result: "abc"
}, {
  name: "testNonPrintableCharacters",
  props: {
    object: "a\x01b",
    useQuotes: false
  },
  result: "a\ufffdb"
}, {
  name: "testQuoting",
  props: {
    object: "\t\n\r\"'\\\x1f\x9f\ufeff\ufffe\ud8000\u2063\ufffc\u2028\ueeee",
    useQuotes: true
  },
  // eslint-disable-next-line max-len
  result: "\"\\t\\n\\r\\\"'\\\\\\u001f\\u009f\\ufeff\\ufffe\\ud8000\\u2063\\ufffc\\u2028\\ueeee\""
}, {
  name: "testUnpairedSurrogate",
  props: {
    object: "\uDC23",
    useQuotes: true
  },
  result: "\"\\udc23\""
}, {
  name: "testValidSurrogate",
  props: {
    object: "\ud83d\udeec",
    useQuotes: true
  },
  result: "\"\ud83d\udeec\""
}, {
  name: "testNoEscapeWhitespace",
  props: {
    object: "line 1\r\nline 2\n\tline 3",
    useQuotes: true,
    escapeWhitespace: false,
  },
  result: "\"line 1\r\nline 2\n\tline 3\""
}];

describe("test String", () => {
  for (let testCase of testCases) {
    it(`String rep ${testCase.name}`, () => {
      const renderedComponent = shallow(Rep(testCase.props));
      expect(renderedComponent.text()).toEqual(testCase.result);
    });
  }
});
