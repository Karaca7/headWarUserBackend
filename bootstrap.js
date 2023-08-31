const { routes } = require("./router/index");

const {verifyRequest}=require('./utils/sessions')
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
    const verify=  verifyRequest(req,res)
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
};

const registerRouter = async (app) => {
  await app.register(routes["auth"], { prefix: "/v1/auth" });
};
