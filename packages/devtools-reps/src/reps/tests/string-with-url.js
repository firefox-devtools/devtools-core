/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

 /* global jest */
const { mount } = require("enzyme");
const { REPS } = require("../rep");
const { Rep } = REPS;

const renderRep = (string, props) => mount(
  Rep(Object.assign({
    object: string
  }, props))
);

describe("test String with URL", () => {
  it("renders a URL", () => {
    const url = "http://example.com";
    const openLink = jest.fn();
    const element = renderRep(url, {openLink, useQuotes: false});
    expect(element.text()).toEqual(url);
    const link = element.find("a");
    expect(link.prop("href")).toBe(url);
    expect(link.prop("title")).toBe(url);

    link.simulate("click");
    expect(openLink).toBeCalledWith(url);
  });

  it("prevent defaults behavior on click", () => {
    const url = "http://example.com";
    const openLink = jest.fn();
    const preventDefault = jest.fn();
    const element = renderRep(url, {openLink, useQuotes: false});
    expect(element.text()).toEqual(url);
    const link = element.find("a");

    link.simulate("click", {preventDefault});
    expect(openLink).toBeCalledWith(url);
    expect(preventDefault).toBeCalled();
  });

  it("renders a simple quoted URL", () => {
    const url = "http://example.com";
    const string = `'${url}'`;
    const openLink = jest.fn();
    const element = renderRep(string, {openLink, useQuotes: false});
    expect(element.text()).toEqual(string);
    const link = element.find("a");
    expect(link.prop("href")).toBe(url);
    expect(link.prop("title")).toBe(url);

    link.simulate("click");
    expect(openLink).toBeCalledWith(url);
  });

  it("renders a double quoted URL", () => {
    const url = "http://example.com";
    const string = `"${url}"`;
    const openLink = jest.fn();
    const element = renderRep(string, {openLink, useQuotes: false});
    expect(element.text()).toEqual(string);
    const link = element.find("a");
    expect(link.prop("href")).toBe(url);
    expect(link.prop("title")).toBe(url);

    link.simulate("click");
    expect(openLink).toBeCalledWith(url);
  });

  it("renders a quoted URL when useQuotes is true", () => {
    const url = "http://example.com";
    const string = `"${url}"`;
    const openLink = jest.fn();
    const element = renderRep(string, {openLink, useQuotes: true});
    expect(element.text()).toEqual(`"\\"${url}\\""`);
    const link = element.find("a");
    expect(link.prop("href")).toBe(url);
    expect(link.prop("title")).toBe(url);

    link.simulate("click");
    expect(openLink).toBeCalledWith(url);
  });

  it("renders a simple https URL", () => {
    const url = "https://example.com";
    const openLink = jest.fn();
    const element = renderRep(url, {openLink, useQuotes: false});
    expect(element.text()).toEqual(url);
    const link = element.find("a");
    expect(link.prop("href")).toBe(url);
    expect(link.prop("title")).toBe(url);

    link.simulate("click");
    expect(openLink).toBeCalledWith(url);
  });

  it("renders a URL with port", () => {
    const url = "https://example.com:443";
    const openLink = jest.fn();
    const element = renderRep(url, {openLink, useQuotes: false});
    expect(element.text()).toEqual(url);
    const link = element.find("a");
    expect(link.prop("href")).toBe(url);
    expect(link.prop("title")).toBe(url);

    link.simulate("click");
    expect(openLink).toBeCalledWith(url);
  });

  it("renders a URL with non-empty path", () => {
    const url = "http://example.com/foo";
    const openLink = jest.fn();
    const element = renderRep(url, {openLink, useQuotes: false});
    expect(element.text()).toEqual(url);
    const link = element.find("a");
    expect(link.prop("href")).toBe(url);
    expect(link.prop("title")).toBe(url);

    link.simulate("click");
    expect(openLink).toBeCalledWith(url);
  });

  it("renders a URL when surrounded by non-URL tokens", () => {
    const url = "http://example.com";
    const string = `foo ${url} bar`;
    const openLink = jest.fn();
    const element = renderRep(string, {openLink, useQuotes: false});
    expect(element.text()).toEqual(string);
    const link = element.find("a");
    expect(link.prop("href")).toBe(url);
    expect(link.prop("title")).toBe(url);

    link.simulate("click");
    expect(openLink).toBeCalledWith(url);
  });

  it("renders a URL and whitespace is be preserved", () => {
    const url = "http://example.com";
    const string = `foo\n${url}\nbar\n`;
    const openLink = jest.fn();
    const element = renderRep(string, {openLink, useQuotes: false});
    expect(element.text()).toEqual(string);

    const link = element.find("a");
    expect(link.prop("href")).toBe(url);
    expect(link.prop("title")).toBe(url);

    link.simulate("click");
    expect(openLink).toBeCalledWith(url);
  });

  it("renders multiple URLs", () => {
    const url1 = "http://example.com";
    const url2 = "https://example.com/foo";
    const string = `${url1} ${url2}`;
    const openLink = jest.fn();
    const element = renderRep(string, {openLink, useQuotes: false});
    expect(element.text()).toEqual(string);
    const links = element.find("a");
    expect(links.length).toBe(2);

    const firstLink = links.at(0);
    expect(firstLink.prop("href")).toBe(url1);
    expect(firstLink.prop("title")).toBe(url1);
    firstLink.simulate("click");
    expect(openLink).toBeCalledWith(url1);

    const secondLink = links.at(1);
    expect(secondLink.prop("href")).toBe(url2);
    expect(secondLink.prop("title")).toBe(url2);
    secondLink.simulate("click");
    expect(openLink).toBeCalledWith(url2);
  });

  it("does not render a link if the URL has no scheme", () => {
    const url = "example.com";
    const element = renderRep(url, {useQuotes: false});
    expect(element.text()).toEqual(url);
    expect(element.find("a").exists()).toBeFalsy();
  });

  it("does not render a link if the URL has an invalid scheme", () => {
    const url = "foo://example.com";
    const element = renderRep(url, {useQuotes: false});
    expect(element.text()).toEqual(url);
    expect(element.find("a").exists()).toBeFalsy();
  });

  it("does render a link in a plain array", () => {
    const url = "http://example.com/abcdefghijabcdefghij";
    const string = `${url} some other text`;
    const object = [string];
    const openLink = jest.fn();
    const element = renderRep(object, {openLink});
    expect(element.text()).toEqual(`[ "${string}" ]`);

    const link = element.find("a");
    expect(link.prop("href")).toBe(url);
    expect(link.prop("title")).toBe(url);

    link.simulate("click");
    expect(openLink).toBeCalledWith(url);
  });

  it("does render a link in a grip array", () => {
    let object = require("../stubs/grip-array")
      .get(`["http://example.com/abcdefghijabcdefghij some other text"]`);

    const openLink = jest.fn();
    const element = renderRep(object, {openLink});

    const url = "http://example.com/abcdefghijabcdefghij";
    const string = `${url} some other text`;
    expect(element.text()).toEqual(`Array [ "${string}" ]`);

    const link = element.find("a");
    expect(link.prop("href")).toBe(url);
    expect(link.prop("title")).toBe(url);

    link.simulate("click");
    expect(openLink).toBeCalledWith(url);
  });

  it("does render a link in a plain object", () => {
    const url = "http://example.com/abcdefghijabcdefghij";
    const string = `${url} some other text`;
    const object = {test: string};
    const openLink = jest.fn();
    const element = renderRep(object, {openLink});
    expect(element.text()).toEqual(`Object { test: "${string}" }`);

    const link = element.find("a");
    expect(link.prop("href")).toBe(url);
    expect(link.prop("title")).toBe(url);

    link.simulate("click");
    expect(openLink).toBeCalledWith(url);
  });

  it("does render a link in a grip object", () => {
    let object = require("../stubs/grip")
      .get(`{test: "http://example.com/ some other text"}`);
    const openLink = jest.fn();
    const element = renderRep(object, {openLink});

    const url = "http://example.com/";
    const string = `${url} some other text`;
    expect(element.text()).toEqual(`Object { test: "${string}" }`);

    const link = element.find("a");
    expect(link.prop("href")).toBe(url);
    expect(link.prop("title")).toBe(url);

    link.simulate("click");
    expect(openLink).toBeCalledWith(url);
  });
});
