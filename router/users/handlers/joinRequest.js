exports.handler = async (req, res) => {
  try {
    const EXPIRATION_SECONDS =  60 * 5; // 5 dakika

    let token = req.headers?.authorization;

    let user;
    if (token && token.startsWith("Bearer ")) {
      token = token.substring(7);
    }

    //	competitor -- > yarışmacı demek
    await req.redis
      .multi()
      .hmset(
        `competitor:${token}`,
        "userId",
        req.user.userId,
        "level",
        req.user.level
      )
      .expire(`competitor:${token}`, EXPIRATION_SECONDS)
      .exec();
    res.success({message:'istek kabul edildi'});
  } catch (err) {
    res.serverError("500");
    console.log(err, "eror");
  }
};
