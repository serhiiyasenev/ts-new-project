import { Router, Request, Response, NextFunction } from "express";
import { getAllTasks, getTaskById, createTask, updateTask, deleteTask } from "../controllers/tasks";
import { queryTasksSchema, createTaskSchema, updateTaskSchema, taskIdSchema } from "../schemas/tasks";

const router = Router();

// Validate query params for GET /tasks
function validateQueryParams(req: Request, res: Response, next: NextFunction) {
  const result = queryTasksSchema.safeParse(req.query);
  if (!result.success) {
    return res.status(400).json({
      message: "Invalid query params",
      errors: result.error.issues,
    });
  }
  next();
}

// Validate task body (POST /tasks)
function validateCreateBody(req: Request, res: Response, next: NextFunction) {
  const result = createTaskSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      message: "Invalid body parameters",
      errors: result.error.issues,
    });
  }
  next();
}

// Validate task body (PUT /tasks/:id)
function validateUpdateBody(req: Request, res: Response, next: NextFunction) {
  const result = updateTaskSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      message: "Invalid body parameters",
      errors: result.error.issues,
    });
  }
  next();
}

// Validate task ID param
function validateTaskId(req: Request, res: Response, next: NextFunction) {
  const result = taskIdSchema.safeParse(req.params.id);
  if (!result.success) {
    return res.status(400).json({
      message: result.error.issues[0].message,
    });
  }
  next();
}

// Global route logger for tasks routes
router.use((req, _res, next) => {
  console.log(`Tasks Route - Request: ${req.method} ${req.url}`);
  next();
});

router.get("/", validateQueryParams, getAllTasks);
router.post("/", validateCreateBody, createTask);
router.get("/:id", validateTaskId, getTaskById);
router.put("/:id", validateTaskId, validateUpdateBody, updateTask);
router.delete("/:id", validateTaskId, deleteTask);

export default router;
