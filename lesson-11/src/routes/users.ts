import { Request, Response, NextFunction, Router } from "express";
import { getAllUsers, createUser, getUserById, updateUser, deleteUserById } from "../controllers/users";
import { bodyParamsSchema } from "../schemas/users";

const router = Router();

function validateBodyParams(req: Request, res: Response, next: NextFunction) {
  console.log("Validating body parameters...", req.query);
  const validationResult = bodyParamsSchema.safeParse(req.body);
  if (!validationResult.success) {
    return res.status(400).json({ message: "Invalid body parameters", errors: validationResult.error.issues });
  }
  next();
}

router.use((req, _res, next) => {
  console.log(`Users Route - Request: ${req.method} ${req.url}`);
  next();
});

router.get('/', getAllUsers);
router.post("/", validateBodyParams, createUser);
router.get("/:id", getUserById);
router.put("/:id", validateBodyParams, updateUser);
router.delete("/:id", deleteUserById);

export default router;
