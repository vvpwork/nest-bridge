/* eslint-disable */
const config = require('config');
const schema = config.get('database').schema;

const upsertData = (nameTable, dataKeys, dataValues, conflictKey) => {
  const keyConflict = conflictKey || 'id';
  return `INSERT INTO ${nameTable} (${dataKeys.join(', ')}) VALUES
    ${dataValues
      .map(v => {
        return `(${v.join(', ')})`;
      })
      .join(', ')}
    ON CONFLICT (${keyConflict}) DO UPDATE SET (${dataKeys.join(', ')}) = (${dataKeys.map(v => `EXCLUDED.${v}`).join(', ')})`;
};

const resetSequence = async (queryInterface, table) => {
  const sql = `  
  BEGIN;
    -- protect against concurrent inserts while you update the counter
  LOCK TABLE ${table} IN EXCLUSIVE MODE;
    -- Update the sequence
  SELECT setval('${table}_id_seq', COALESCE((SELECT MAX(id)+1 FROM ${table}), 1), false);
  COMMIT;
  `;

  console.log(sql);

  return queryInterface.sequelize.query(sql, {
    schema,
  });
};

module.exports = {
  upsertData,
  resetSequence,
};
