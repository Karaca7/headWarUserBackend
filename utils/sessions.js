const { v4: uuidv4 } = require("uuid");
// require('dotenv').config()

async function generateToken() {
  const uuid1 = uuidv4().replace(/-/g, "");
  const uuid2 = uuidv4().replace(/-/g, "");
  const token = shuffle(uuid1 + uuid2);
  return token;
}

function shuffle(str) {
  let shuffled = "";
  str.split("").forEach((char) => {
    shuffled += Math.random() > 0.5 ? char.toUpperCase() : char.toLowerCase();
  });
  return shuffled + "==";
}

// console.log(generateToken());

async function verifyRequest(request, reply) {
  let token = request.headers?.authorization;

  let user;
  if (token && token.startsWith("Bearer ")) {
    token = token.substring(7);
    user = await request.redis.hgetall("user:" + token);

    if (user?.userId === undefined) {
      return reply.code(401).send("autherization failed");
    }

    return (request.user = user);
  }
  return reply.code(401).send("autherization failed");
}


const setUser = async (req) => {
  try {
    const EXPIRATION_SECONDS = 12 * 60 * 60; // 12 saat = 12 * 60 * 60 saniye

    const token = await generateToken();

    await req.redis
      .multi()
      .hmset(
        `user:${token}`,
        "userId",
        req.user.id,
        "email",
        req.user.email,
        "level",
        req.user.level
      )
      .expire(`user:${token}`, EXPIRATION_SECONDS)
      .exec();

    return token;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  setUser: setUser,
  verifyRequest: verifyRequest,
};
