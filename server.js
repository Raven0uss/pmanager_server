const app = require("./app");
const sequelize = require("./database/database");
const port = process.env.EXTERNAL_PORT;

(async () => {
  try {
    // Dev only - .sync({ force }) is used to drop the DB at every launch of the server
    // await sequelize.sync({ force: false });
    await sequelize.sync();
    app.listen(port, () => console.log(`# PManager listening on port ${port}`));
  } catch (error) {
    console.error(error);
  }
})();
