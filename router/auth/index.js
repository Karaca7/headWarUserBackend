const handlers = require("./handlers/index");

module.exports = async function (app, opt, done) {
  app.route({
    url: "/login",
    method: "POST",
    config:{private:false},
    schema:handlers.login.schema,
    preHandler:handlers.login.preHandler,
    handler: handlers.login.handler,
  });

  //   app.post("/register", (req, res) => {
  //     res.send("register");
  //   });

  done();
};
