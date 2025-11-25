import { NextFunction, Request, Response } from "express";
import * as userService from "../services/users";

export const getAllUsers = async (
  req: Request<{}, {}, {}, Record<string, string | undefined>>,
  res: Response,
  next: NextFunction
) => {
  try {
  const users = await userService.getAllUsers(req.query);
  res.json(users);
   } catch(err) {
    next(err);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.getUserById(Number(req.params.id));
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json(user);
  } catch (err) {
    next(err);
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.createUser(req.body);
    return res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updated = await userService.updateUser(
      Number(req.params.id),
      req.body as Partial<{ name: string; email: string }>
    );
    if (!updated) return res.status(404).json({ message: "User not found" });
    return res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const deleteUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deleted = await userService.deleteUser(Number(req.params.id));
    if (!deleted) return res.status(404).json({ message: "User not found" });
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
};
