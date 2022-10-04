export const sleep = async (ms: number) =>
  new Promise((resolve: any, reject: any) => {
    setTimeout(resolve, ms);
  });
