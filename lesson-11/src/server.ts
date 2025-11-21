import express, { Request, Response } from "express";
import userRoutes from "./routes/users";
import { ApiError } from "./types/errors";
import morgan from 'morgan';
import cors from 'cors';

const app = express();
const port = 3000;  

// parse JSON bodies
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

// use user routes
app.use("/users", userRoutes);

// Root route for GET /
app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "API root. Use /users for user operations." });
});

// simple request logger
app.use((req, _res, next) => {
  console.log(`Request: ${req.method} ${req.url}`);
  next();
});

// Catch-all for unknown routes (404)
app.use((req, res, next) => {
  if (res.headersSent) return next();
  res.status(404).json({ message: "Not Found" });
});

// Error handler
app.use((err: ApiError, _req: Request, res: Response, _next: Function) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({ message: err.message || "Internal Server Error" });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});