const credentials = `${process.env.DB_USER}:${process.env.DB_PASSWORD}`;
const server = `${process.env.DB_HOST}:${process.env.PORT}`;
module.exports = `mongodb://${credentials}@${server}/${process.env.DB_NAME}?authSource=admin`;
