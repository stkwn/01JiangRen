const express = require("express");
const cors = require("cors");
const apiRouter = require('../app/routes/v1/api');
const config = require('../app/config/app');

const startServer = () => {
  const application = express();
  console.log(config.port);
  console.log(config.api.prefix);
  application.listen(config.port, (err) => {
    if (err) {
      process.exit(1);
      return;
    }
  })
  console.log("server started at http://localhost:8080");
  return application;
};

module.exports =()=>{
    const app = startServer();   
    app.use(express.json());
    app.use(config.api.prefix,apiRouter);
    return app;
}
