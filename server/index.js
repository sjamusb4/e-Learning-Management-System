const express = require("express");
const app = express();
require("dotenv").config();
const { userRouter } = require("./routes/user.route");

const PORT = process.env.PORT || 3001;

app.use(express.json());

app.use("/api/user", userRouter);

app.get("/", (req, res) => {
  res.send({
    msg: "Hello From Server",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT : ${PORT}`);
});
