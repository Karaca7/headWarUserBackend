const handlers = require("./handlers/index");

module.exports = function (app, opt, done) {
  app.route({
    path: "/find",
    method: "GET",
    config: { private: false },
    handler: handlers.findMatch.handler,
  });

  app.route({
    path: "/request/join",
    method: "POST",
    config: { private: true },
    handler: handlers.joinRequest.handler,
  });

  done();
};
