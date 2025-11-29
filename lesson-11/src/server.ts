import express, { Request, Response } from "express";
import { RegisterRoutes } from "./routes-tsoa/routes";
import morgan from "morgan";
import cors from "cors";
import "./config/database";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger/swagger.json";
import { errorHandler } from "./helpers/errorHandler";
import { logger } from "./helpers/logger";

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

// parse JSON bodies
app.use(express.json());

// Morgan logging (dev only)
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.use(cors());

// Swagger UI setup http://localhost:3000/swagger
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Request logging middleware
app.use((req, res, next) => {
  const startTime = Date.now();
  logger.info("Incoming request", {
    method: req.method,
    path: req.path,
    ip: req.ip,
  });

  res.on("finish", () => {
    const duration = Date.now() - startTime;
    logger.info("Request completed", {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
    });
  });

  next();
});

// Response wrapper middleware is removed - TSOA controllers return data directly
// The frontend client handles both wrapped and unwrapped responses

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
app.use(errorHandler);

// Start server
if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    logger.info("Server started", {
      port,
      environment: process.env.NODE_ENV || "development",
      swaggerUrl: `http://localhost:${port}/swagger`,
    });
  });
}

export default app;
