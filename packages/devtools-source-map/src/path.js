// @flow

function basename(path: string) {
  return path.split("/").pop();
}

function dirname(path: string) {
  const idx = path.lastIndexOf("/");
  return path.slice(0, idx);
}

function isURL(str: string) {
  try {
    new URL(str);
    return true;
  } catch (e) {
    return false;
  }
}

function isAbsolute(str: string) {
  return str[0] === "/";
}

function join(base: string, dir: string) {
  return `${base}/${dir}`;
}

module.exports = {
  basename, dirname, isURL, isAbsolute, join
};
