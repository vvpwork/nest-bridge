const config = require('config');

const { schema } = config.get('db');

// TODO Refactor
const upsert = (tableName, keys, values, conflictKey) => {
  const keyConflict = conflictKey || 'id';
  const table = `${schema ? `${schema}.` : ''}${tableName}`;

  return `INSERT INTO ${table} (${keys.join(', ')}) VALUES
    ${values
      .map(v => {
        return `(${v.join(', ')})`;
      })
      .join(', ')}
    ON CONFLICT (${keyConflict}) DO UPDATE SET (${keys.join(', ')}) = (${keys.map(v => `EXCLUDED.${v}`).join(', ')})`;
};

module.exports = {
  upsert,
};
