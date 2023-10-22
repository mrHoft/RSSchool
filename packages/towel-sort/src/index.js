function towelSort(matrix) {
    return matrix
        ? matrix.reduce(
              (acc, cur, i) => acc.concat(i % 2 === 0 ? cur : cur.reverse()),
              []
          )
        : [];
}

module.exports = towelSort;
