export const paginate = async (
  model: { findAndCountAll(query: Record<string, unknown>): any },
  options: {
    where: Record<string, unknown>;
    offset?: number;
    limit?: number;
    attributes?: any[];
    include?: any[];
    order?: any[];
  },
) => {
  const { count, rows } = await model.findAndCountAll({ ...options, distinct: true });

  return {
    pagination: {
      offset: options.offset,
      limit: options.limit,
      total: count,
    },
    data: rows,
  };
};
