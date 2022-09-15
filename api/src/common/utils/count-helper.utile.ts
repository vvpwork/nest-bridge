export const countHelper = (data: any[]) => {
  let total = 0;
  const result = data.map((r: any) => {
    const { count, ...resultData } = r;
    total = count;
    return resultData;
  });
  return {
    total,
    result,
  };
};
