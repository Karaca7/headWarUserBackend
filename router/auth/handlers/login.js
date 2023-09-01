const { setUser } = require("../../../utils/sessions");
const { passwordHassing } = require("../../../utils/password");


exports.schema = {
  body: {
    type: "object",
    properties: {
      email: { type: "string" },
      password: { type: "string" },
    },
    required: ["email", "password"],
  },
};

exports.preHandler = async (req, res) => {
  const { email, password } = req?.body;
  const hashPasword=passwordHassing(password)
  let result = await req.db("users").select().where({ email, hashPasword });

  if (result.length <= 0)
    return res.send("Lütfen geçerli bir kullanıcı giriniz");

  req.user = result[0];

  return;
};
exports.handler = async (req, res) => {
  console.log(req.user);

  const token = await setUser(req);


  res.send({ token });
};
