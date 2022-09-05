/* eslint-disable */
const upsertData = (nameTable, dataKeys, dataValues) => {
  const table = `${nameTable}`;

  return `INSERT INTO ${table} (${dataKeys.join(', ')}) VALUES
    ${dataValues
      .map(v => {
        return `(${v.join(', ')})`;
      })
      .join(', ')}
    ON DUPLICATE KEY UPDATE ${dataKeys.map(v => `${v} = ${v}`).join(', ')}`;
};

const resetSequence = async (queryInterface, table) => {
  const sql = `ALTER TABLE ${table} AUTO_INCREMENT = 1`;

  console.log(sql);

  return queryInterface.sequelize.query(sql);
};

module.exports = {
  upsertData,
  resetSequence,
};
