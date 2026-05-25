const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { userRouter } = require("./routes/user.route");
const { moduleRouter } = require("./routes/module.route");
const { lessonRouter } = require("./routes/lesson.route");
const { enrollmentRouter } = require("./routes/enrollment.route");
const { lessonProgressRouter } = require("./routes/lessonProgress.route");

const PORT = process.env.PORT || 3001;
app.use(cors());
app.use(express.json());

app.use("/api/user", userRouter);
app.use("/api/module", moduleRouter);
app.use("/api/lesson", lessonRouter);
app.use("/api/enrollment", enrollmentRouter);
app.use("/api/lesson-progress", lessonProgressRouter);

app.get("/", (req, res) => {
  res.send({
    msg: "Hello From Server",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT : ${PORT}`);
});
