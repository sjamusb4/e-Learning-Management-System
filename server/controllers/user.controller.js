async function handelRegisterUser(req, res) {
  res.send({
    msg: "Register User",
  });
}
async function handelLoginUser(req, res) {
  res.send({
    msg: "Login User",
  });
}

module.exports = {
  handelRegisterUser,
  handelLoginUser,
};
