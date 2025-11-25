import { Router, Request, Response, NextFunction } from 'express';
import {getAllTasks,getTaskById,createTask,updateTask,deleteTask } from '../controllers/tasks';
import { createTaskSchema, queryTasksSchema } from '../schemas/tasks';

const router = Router();

// Middleware: validate query params for GET /tasks
function validateQueryParams(req: Request, res: Response, next: NextFunction) {
  const result = queryTasksSchema.safeParse(req.query);
  if (!result.success) {
    return res.status(400).json({ message: 'Invalid query params', errors: result.error.issues });
  }
  next();
}

// Middleware: validate body for POST/PUT in this case use createTaskSchema for both
function validateBodyParams(req: Request, res: Response, next: NextFunction) {
  const schema = req.method === 'PUT' ? createTaskSchema.partial() : createTaskSchema;
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ message: 'Invalid body', errors: result.error.issues });
  }
  next();
}

router.use((req, _res, next) => {
  console.log(`Tasks Route - Request: ${req.method} ${req.url}`);
  next();
});

router.get('/', validateQueryParams, getAllTasks);
router.post('/', validateBodyParams, createTask);
router.get('/:id', getTaskById);
router.put('/:id', validateBodyParams, updateTask);
router.delete('/:id', deleteTask);

export default router;
