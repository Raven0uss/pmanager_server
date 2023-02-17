// @ app.js

const app = require("./app");
const sequelize = require("./database/database");
const port = process.env.EXTERNAL_PORT;
(async () => {
  try {
    // await sequelize.sync({ force: false });
    await sequelize.sync();
    app.listen(port, () => console.log(`# PManager listening on port ${port}`)); //DEF in docker.compose.yml
  } catch (error) {
    console.log(error);
  }
})();
