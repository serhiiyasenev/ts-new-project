import express, { NextFunction, Request, Response } from "express";
import { RegisterRoutes } from "./routes-tsoa/routes";
import { ApiError, EmailAlreadyExistsError } from "./types/errors";
import { ValidateError } from "tsoa";
import morgan from "morgan";
import cors from "cors";
import "./config/database";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger/swagger.json";

const app = express();
const port = 3000;

// parse JSON bodies
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

// Swagger UI setup http://localhost:3000/swagger
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// simple request logger
app.use((req, _res, next) => {
  console.log(`Request: ${req.method} ${req.url}`);
  next();
});

// TSOA auto-generated routes
RegisterRoutes(app);

// Root route
app.get("/", (_req: Request, res: Response) => {
  res.json({
    message: "API root. Use /users, /posts and /tasks for operations.",
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Not Found" });
});

// Error handler (must be last)
app.use((err: unknown, req: Request, res: Response, _next: NextFunction) => {
  console.error("Error:", err);

  if (err instanceof ValidateError) {
    const messages = Object.values(err.fields ?? {}).map(
      (field) => field.message,
    );
    const details = messages.length ? messages.join("; ") : "Validation failed";
    return res.status(400).json({ message: details });
  }

  if (err instanceof EmailAlreadyExistsError) {
    return res.status(409).json({ message: err.message });
  }

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  res.status(500).json({ message: "Internal server error" });
});

// Start server
if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log(`Swagger UI: http://localhost:${port}/swagger`);
  });
}

export default app;
