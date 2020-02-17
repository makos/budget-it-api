module.exports = {
  "development": {
    "username": process.env.DB_DEVUSER,
    "password": process.env.DB_DEVPASSWORD,
    "database": "BudgetDev",
    "host": "127.0.0.1",
    "dialect": "mariadb",
    "dialectOptions": {
      timezone: 'Etc/GMT-1'
    },
    "secret": process.env.JWT_SECRET,
    "jwtExp": '365d',
  },
  "test": {
    "username": "budgetTest",
    "password": "",
    "database": "BudgetTest",
    "host": "127.0.0.1",
    "dialect": "mariadb",
    "dialectOptions": {
      timezone: 'Etc/GMT-1'
    },
    "secret": "testsecret",
    "jwtExp": '1m',
    "logging": false,
  },
  "production": {
    "username": process.env.DB_USER,
    "password": process.env.DB_PASSWORD,
    "database": "BudgetIt",
    "host": "127.0.0.1",
    "dialect": "mariadb",
    "dialectOptions": {
      timezone: 'Etc/GMT-1'
    },
    "secret": process.env.JWT_SECRET,
    "jwtExp": '7d',
  }
};
