import express from "express";
import matchRouter from "./routes/matches.route";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(morgan("combined"));
app.use(helmet());
app.use(cors());
app.use(express.json());

// rate limitter
app.set("trust-proxy", 1);
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // limit each IP to 15 requests per window
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false, // Disable X-RateLimit-* headers
  message: {
    status: 429,
    error: "Too many requests",
    message: "Please try again later.",
  },
});
app.use("/api", limiter);
// routes
app.use("/api", matchRouter);

app.listen(PORT, () => {
  console.log(`Listening on PORT=${PORT}`);
});
