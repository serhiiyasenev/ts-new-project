import { Request, Response, NextFunction, Router } from "express";
import { getAllUsers, createUser, getUserById, updateUser, deleteUserById } from "../controllers/users";
import { bodyParamsSchema, queryUsersSchema, userIdSchema, updateBodySchema } from "../schemas/users";

const router = Router();

function validateBodyParams(req: Request, res: Response, next: NextFunction) {
  console.log("Validating body parameters...", req.query);
  const validationResult = bodyParamsSchema.safeParse(req.body);
  if (!validationResult.success) {
    return res.status(400).json({ message: "Invalid body parameters", errors: validationResult.error.issues });
  }
  next();
}

function validateUpdateBodyParams(req: Request, res: Response, next: NextFunction) {
  console.log("Validating update body parameters...", req.query);
  const validationResult = updateBodySchema.safeParse(req.body);
  if (!validationResult.success) {
    return res.status(400).json({ message: "Invalid body parameters", errors: validationResult.error.issues });
  }
  next();
}

function validateQueryParams(req: Request, res: Response, next: NextFunction) {
  const result = queryUsersSchema.safeParse(req.query);
  if (!result.success) {
    return res.status(400).json({ message: 'Invalid query params', errors: result.error.issues });
  }
  next();
}

function validateUserId(req: Request, res: Response, next: NextFunction) {
  const result = userIdSchema.safeParse(req.params.id);
  if (!result.success) {
    return res.status(400).json({message: result.error.issues[0].message});
  }
  next();
}

router.use((req, _res, next) => {
  console.log(`Users Route - Request: ${req.method} ${req.url}`);
  next();
});

router.get('/', validateQueryParams, getAllUsers);
router.post("/", validateBodyParams, createUser);
router.get("/:id", validateUserId, getUserById);
router.put("/:id", validateUserId, validateUpdateBodyParams, updateUser);
router.delete("/:id", validateUserId, deleteUserById);

export default router;
