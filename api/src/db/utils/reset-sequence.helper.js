async function resetSequence(queryInterface, table, options = {}) {
  const sql = `
    BEGIN;
      -- protect against concurrent inserts while you update the counter
    LOCK TABLE ${table} IN EXCLUSIVE MODE;
      -- Update the sequence
    SELECT
      setval('${table}_id_seq',
      COALESCE((SELECT MAX(id)+1 FROM ${table}), 1), false);
    COMMIT;
  `;

  console.log(`Reset sequence for table: ${table}`, sql);

  return queryInterface.sequelize.query(sql, {
    schema: options.schema || 'public',
  });
}

module.exports = {
  resetSequence,
};
