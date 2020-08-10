export const waitFor = (condition) =>
  new Promise((resolve) => {
    function timer() {
      setTimeout(() => {
        if (condition) {
          resolve();
        } else {
          timer();
        }
      }, 1000);
    }
    timer();
  });
