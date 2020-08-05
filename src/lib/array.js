export const compact = (array) => {
  return array.filter((el) => {
    if (typeof el === "string") {
      return Boolean(el.trim());
    }
    return Boolean(el);
  });
};

export const cloneDeep = (array) => {
  return JSON.parse(JSON.stringify(array));
};
