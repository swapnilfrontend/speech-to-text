export const flatten = (list) => {
  return list.filter((el) => {
    if (typeof el === "string") {
      return Boolean(el.trim());
    }
    return Boolean(el);
  });
};
