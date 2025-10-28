import { Request, Response, NextFunction, Router } from "express";
import { getAllUsers, createUser, getUserById, updateUser } from "../controllers/users";
import { z } from "zod";

const router = Router();

const bodyParamsSchema = z.object({
  id: z.uuid(),
  name: z.string().min(3)
});

function validateBodyParams(req: Request, res: Response, next: NextFunction) {
  console.log("Validating body parameters...");
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
router.post("/", createUser);
router.get("/:id", getUserById);
router.put("/:id", validateBodyParams,updateUser);

export default router;
