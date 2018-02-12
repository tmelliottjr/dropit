module.exports = {
  development: {
    username: 'notarealusername',
    password: 'notarealpassword',
    database: 'notarealdb',
    host: 'notarealhost',
    dialect: 'mysql',
    use_env_variable: false
  },
  test: {
    dialect: "sqlite",
    storage: ":memory:"
  },
  production: {
    use_env_variable: false,
    username: 'notarealusername',
    password: 'notarealpassword',
    database: 'notarealdb',
    host: '127.0.0.1',
    dialect: 'mysql',
    logging: false
  }
};