import express from "express";

//env
import { ENV } from "./utils/env.js";

//middlewares
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import errorMiddleware from "./middlewares/error.middleware.js";

//routes
import userRoutes from "./routes/user.route.js";
import notificationRoutes from "./routes/notification.route.js";
import authRoutes from "./routes/auth.route.js";
import todoRoutes from "./routes/todo.route.js";

//db
import { connectToDb } from "./db/connectToDb.js";

const app = express();

const port = ENV.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(
  helmet({
    crossOriginResourcePolicy: false,
    contentSecurityPolicy: false,
  })
);
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/todos", todoRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/auth", authRoutes);

app.use(errorMiddleware);

connectToDb()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
  });