export const paginate = async (
  model: { findAndCountAll(query: Record<string, unknown>) },
  options: { query: Record<string, unknown>; offset?: number; limit?: number },
) => {
  const { count, rows } = await model.findAndCountAll({ options });

  return {
    offset: options.offset,
    limit: options.limit,
    total: count,
    data: rows,
  };
};
