/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const {
  makeNodesForProperties,
  SAFE_PATH_PREFIX,
} = require("../../utils");
const gripArrayStubs = require("../../../reps/stubs/grip-array");

const root = {
  path: "root",
  contents: {
    value: gripArrayStubs.get("testBasic")
  }
};

describe("makeNodesForProperties", () => {
  it("handles simple numerical buckets", () => {
    let objProps = { ownProperties: {}, prototype: {} };
    for (let i = 0; i < 331; i++) {
      objProps.ownProperties[i] = { value: {} };
    }
    const nodes = makeNodesForProperties(objProps, root);

    const names = nodes.map(n => n.name);
    const paths = nodes.map(n => n.path);

    expect(names).toEqual([
      "[0…99]",
      "[100…199]",
      "[200…299]",
      "[300…330]",
      "__proto__"
    ]);

    expect(paths).toEqual([
      `root/${SAFE_PATH_PREFIX}bucket_0-99`,
      `root/${SAFE_PATH_PREFIX}bucket_100-199`,
      `root/${SAFE_PATH_PREFIX}bucket_200-299`,
      `root/${SAFE_PATH_PREFIX}bucket_300-330`,
      "root/__proto__"
    ]);
  });

  it("does not create a numerical bucket for a single node", () => {
    let objProps = { ownProperties: {}, prototype: {} };
    for (let i = 0; i <= 100; i++) {
      objProps.ownProperties[i] = { value: {} };
    }
    const nodes = makeNodesForProperties(objProps, root);

    const names = nodes.map(n => n.name);
    const paths = nodes.map(n => n.path);

    expect(names).toEqual([
      "[0…99]",
      "100",
      "__proto__"
    ]);

    expect(paths).toEqual([
      `root/${SAFE_PATH_PREFIX}bucket_0-99`,
      `root/100`,
      "root/__proto__"
    ]);
  });

  it("does create a numerical bucket for two node", () => {
    let objProps = { ownProperties: {}, prototype: {} };
    for (let i = 0; i <= 101; i++) {
      objProps.ownProperties[i] = { value: {} };
    }
    const nodes = makeNodesForProperties(objProps, root);

    const names = nodes.map(n => n.name);
    const paths = nodes.map(n => n.path);

    expect(names).toEqual([
      "[0…99]",
      "[100…101]",
      "__proto__"
    ]);

    expect(paths).toEqual([
      `root/${SAFE_PATH_PREFIX}bucket_0-99`,
      `root/${SAFE_PATH_PREFIX}bucket_100-101`,
      "root/__proto__"
    ]);
  });

  it("creates sub-buckets when needed", () => {
    let objProps = { ownProperties: {}, prototype: {} };
    for (let i = 0; i <= 10200; i++) {
      objProps.ownProperties[i] = { value: {} };
    }
    const nodes = makeNodesForProperties(objProps, root);

    const names = nodes.map(n => n.name);

    expect(names).toEqual([
      "[0…999]",
      "[1000…1999]",
      "[2000…2999]",
      "[3000…3999]",
      "[4000…4999]",
      "[5000…5999]",
      "[6000…6999]",
      "[7000…7999]",
      "[8000…8999]",
      "[9000…9999]",
      "[10000…10200]",
      "__proto__"
    ]);

    const firstBucketNodes = nodes[0].contents;
    const firstBucketNames = firstBucketNodes.map(n => n.name);
    const firstBucketPaths = firstBucketNodes.map(n => n.path);

    expect(firstBucketNames).toEqual([
      "[0…99]",
      "[100…199]",
      "[200…299]",
      "[300…399]",
      "[400…499]",
      "[500…599]",
      "[600…699]",
      "[700…799]",
      "[800…899]",
      "[900…999]",
    ]);
    expect(firstBucketPaths[0]).toEqual(
      `root/${SAFE_PATH_PREFIX}bucket_0-999/${SAFE_PATH_PREFIX}bucket_0-99`,
    );
    expect(firstBucketPaths[firstBucketPaths.length - 1]).toEqual(
      `root/${SAFE_PATH_PREFIX}bucket_0-999/${SAFE_PATH_PREFIX}bucket_900-999`,
    );

    const lastBucketNodes = nodes[nodes.length - 2].contents;
    const lastBucketNames = lastBucketNodes.map(n => n.name);
    const lastBucketPaths = lastBucketNodes.map(n => n.path);
    expect(lastBucketNames).toEqual([
      "[10000…10099]",
      "[10100…10199]",
      "10200",
    ]);
    expect(lastBucketPaths[0]).toEqual(
      `root/${SAFE_PATH_PREFIX}bucket_10000-10200/${SAFE_PATH_PREFIX}bucket_10000-10099`,
    );
    expect(lastBucketPaths[lastBucketPaths.length - 1]).toEqual(
      `root/${SAFE_PATH_PREFIX}bucket_10000-10200/10200`,
    );
  });
});
