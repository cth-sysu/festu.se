const credentials = `${process.env.DB_USER}:${process.env.DB_PASSWORD}`;
const server = `${process.env.DB_HOST}:${process.env.PORT}`;
const authSource = process.env.DB_AUTH_NAME || process.env.DB_NAME;
module.exports = `mongodb://${credentials}@${server}/${process.env.DB_NAME}?authSource=${authSource}`;
