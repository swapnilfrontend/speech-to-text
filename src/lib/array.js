export const compact = (array) => {
  return array.filter((el) => {
    if (typeof el === "string") {
      return Boolean(el.trim());
    }
    return Boolean(el);
  });
};

export const deepClone = (array) => {
  return JSON.parse(JSON.stringify(array));
};

export const deepEqual = (array1, array2) => {
  return JSON.stringify(array1) === JSON.stringify(array2);
};
