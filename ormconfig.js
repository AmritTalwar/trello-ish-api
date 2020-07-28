const ormconfig = {
  type: "postgres",
  host: process.env["DB_HOST"] || undefined,
  port: process.env["DB_PORT"] || undefined,
  username: process.env["DB_USERNAME"] || undefined,
  password: process.env["DB_PASSWORD"] || undefined,
  database: process.env["DB_NAME"] || undefined,
  synchronize: true,
};

module.exports = ormconfig;
