let sum = 0;
function fn(a, { b }, ...c) {
  for (let i of [1, 2]) {
    const item = a + i + sum;
    {
      sum += item;
    }
    let { d: f, g = 5 } = b;
    const [ e ] = c;
  }
}
