function check(str, conf) {
  const out = [];
  const arr = str.split("");
  for (const b of arr) {
    if (conf.some((v) => v[1] === b && out.slice(-1)[0] === v[0])) out.pop();
    else if (conf.some((v) => v[0] === b)) out.push(b);
    else return false;
    // console.log(b, out.join(""));
  }
  return !out.length;
}

module.exports = check;
