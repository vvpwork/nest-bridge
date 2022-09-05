export const paginate = async (
  model: { findAndCountAll(query: Record<string, unknown>) },
  query: Record<string, unknown>,
  offset: number = 0,
  limit: number = 10,
) => {
  const { count, rows } = await model.findAndCountAll({ ...query, limit, offset });

  return {
    offset,
    limit,
    total: count,
    data: rows,
  };
};
