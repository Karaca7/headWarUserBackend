const { routes } = require("./router/index");

const { verifyRequest } = require("./utils/sessions");
const Knex = require("knex").default;

const Redis = require("ioredis").default;




const redis = new Redis({
  host: "127.0.0.1", // Redis sunucusunun IP adresi
  port: 6375, // Redis sunucusunun portu
  db: 0, // Kullanılacak veritabanı indeksi
});

const knex = Knex({
  client: "mysql2",

  connection: {
    host: "localhost", // MySQL sunucusunun IP adresi veya alan adı
    user: "root", // MySQL kullanıcı adı
    password: "root", // MySQL şifresi
    database: "headWar", // Bağlanmak istediğiniz veritabanının adı,
    port: 3306,
  },
  pool: {
    min: 0,
    max: 10,
  },
  useNullAsDefault: true,
});

module.exports = async (app) => {
  app.addHook("onRequest", (req, res, done) => {
    req.db = knex;

    req.redis = redis;

    if (req.context.config.private) {
      console.log(req.context.config.private);
      const verify = verifyRequest(req, res);
      //session control yapılmalı redis üzerinde login mi değil mi kontorl edilmeli
    }

    done();
  });

  //   console.log(app.db);

  //  let result=  await knex('users').select()
  //  console.log(result,"na bura");
  //    let result= await app.db('auth').select('*')
  //   console.log(result,"test123");

  //regiter route
  await registerRouter(app);

  // response sechema

  await addResponse(app);
};

const registerRouter = async (app) => {
  await app.register(routes["auth"], { prefix: "/v1/auth" });
  await app.register(routes["users"], { prefix: "/v1/users" });

};

const addResponse = async (app) => {
  app.decorateReply("serverError", function (data, error = "") {
    if (!this.sent) {
      return this.code(500)
        .header("Content-Type", "application/json")
        .send({
          status: false,
          message: "Server hatası lütfen daha sonra tekrar deneyin.",
        });
    }
  });
  app.decorateReply("badRequest", function (message, req = null) {
    if (!this.sent) {
      return this.code(400)
        .header("Content-Type", "application/json")
        .send({
          status: false,
          message: message
            ? message
            : "Geçersiz istek: Eksik veya hatalı alanlar.",
        });
    }
  });

  app.decorateReply("success", function (data, message) {
    if (!this.sent) {
      return this.code(200)
        .header("Content-Type", "application/json")
        .send({
          status: true,
          message: message ? message : "İşlem başarıyla gerçekleşti.",
          data: data,
        });
    }
  });

  app.decorateReply("notFound", function (message) {
    if (!this.sent) {
      app.log.error(message);
      return this.code(404)
        .header("Content-Type", "application/json")
        .send({
          status: false,
          message: message ? message : "Kaynak bulunamadı.",
        });
    }
  });
  app.decorateReply("failed", function (data, message) {
    if (!this.sent) {
      return this.code(404)
        .header("Content-Type", "application/json")
        .send({
          status: false,
          message: message ? message : "İşlem başarısız oldu.",
          data: data,
        });
    }
  });

  app.decorateReply("deneme", function (data) {
    if (!this.sent) {
      return this.code(200)
        .header("Content-Type", "application/json")
        .send({ data: "data" });
    }
  });
};
