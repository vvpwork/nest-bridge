const nodeConfig = require('config');
const db = nodeConfig.get('db');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
    CREATE TRIGGER amount_order_trigger
    BEFORE INSERT ON Orders
    FOR EACH ROW BEGIN
      IF New.amount > (SELECT amount FROM IdentityNftBalance WHERE id = New.nftIdentityBalanceId)
      THEN SIGNAL SQLSTATE '40001' SET MESSAGE_TEXT = 'USER does not have enough balance';
      END IF;
    END;
    `);

    await queryInterface.sequelize.query(`
    CREATE TRIGGER lock_balance_trigger
    BEFORE INSERT ON IdentityNftBalanceLock
    FOR EACH ROW BEGIN
      IF New.amount > (SELECT amount FROM IdentityNftBalance WHERE id = New.identityNftBalanceId)
      THEN SIGNAL SQLSTATE '40001' SET MESSAGE_TEXT = 'USER does not have enough balance';
      END IF;
      IF New.unlockTime < (SELECT UNIX_TIMESTAMP())
      THEN SIGNAL SQLSTATE '40002' SET MESSAGE_TEXT = 'Incorrect unlock time';
      END IF;
    END;
    `);

    await queryInterface.sequelize.query(`
    CREATE TRIGGER delete_empty_orders
    BEFORE INSERT ON TransactionHistory 
    FOR EACH ROW BEGIN 
      DELETE FROM Orders where amount = 0;
    END;
    `);
  },

  down: async queryInterface => {
    await queryInterface.sequelize.query('DROP TRIGGER  amount_order_trigger');
    await queryInterface.sequelize.query('DROP TRIGGER lock_balance_trigger');
    await queryInterface.sequelize.query('DROP TRIGGER delete_empty_orders');
  },
};
