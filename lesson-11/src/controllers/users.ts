import { Request, Response } from "express";
import * as userService from "../services/users";

export const getAllUsers = (req: Request<{}, {}, {}, Record<string, string | undefined>>, res: Response) => {
  const { createdAt, name } = req.query;
  const filters: { createdAt?: string; name?: string } = {};
  if (createdAt) filters.createdAt = createdAt;
  if (name) filters.name = name;
  const users = userService.getAllUsers(filters);
  res.json(users);
};

export const createUser = (req: Request, res: Response) => {
  const { name } = req.body as { name?: string };
  if (!name) {
    return res.status(400).json({ message: "Missing user name" });
  }

  const created = userService.createUser(name);
  res.status(201).json(created);
};

export const getUserById = (req: Request, res: Response) => {
  const idParam = req.params.id;
  if (!idParam) {
    return res.status(400).json({ message: "Missing user id" });
  }

  const user = userService.getUserById(idParam);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

export const updateUser = (req: Request, res: Response) => {
  const idParam = req.params.id;
  if (!idParam) {
    return res.status(400).json({ message: "Missing user id" });
  }

  const updated = userService.updateUser(idParam, req.body as Partial<{ name: string }>);
  if (updated) {
    res.json(updated);
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

export const deleteUserById = (req: Request, res: Response) => {
  const idParam = req.params.id; 
  if (!idParam) {
    return res.status(400).json({ message: "Missing user id" });
  }

  const deleted = userService.deleteUser(idParam);
  if (deleted) {
    res.status(204).send();
  } else {
    res.status(404).json({ message: "User not found" });
  }
};