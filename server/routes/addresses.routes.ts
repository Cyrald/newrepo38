import { Router } from "express";
import { storage } from "../storage";
import { authenticateToken } from "../auth";
import { createAddressSchema, updateAddressSchema } from "@shared/schema";
import { requireOwnership } from "../middleware/resourceOwnership";
import { z } from "zod";

const router = Router();

router.get("/", authenticateToken, async (req, res) => {
  const addresses = await storage.getUserAddresses(req.userId!);
  res.json(addresses);
});

router.post("/", authenticateToken, async (req, res) => {
  try {
    const data = createAddressSchema.parse(req.body);
    
    const address = await storage.createUserAddress({
      ...data,
      userId: req.userId!,
      apartment: data.apartment || null,
    });

    if (data.isDefault) {
      await storage.setDefaultAddress(req.userId!, address.id);
    }

    res.json(address);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: error.errors[0].message,
        errors: error.errors 
      });
    }
    throw error;
  }
});

router.put(
  "/:id", 
  authenticateToken,
  requireOwnership(
    (id) => storage.getUserAddress(id),
    "Адрес"
  ),
  async (req, res) => {
    try {
      const data = updateAddressSchema.parse(req.body);

      const updated = await storage.updateUserAddress(req.params.id, {
        ...data,
        apartment: data.apartment || null,
      });

      res.json(updated);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: error.errors[0].message,
          errors: error.errors 
        });
      }
      throw error;
    }
  }
);

router.delete(
  "/:id",
  authenticateToken,
  requireOwnership(
    (id) => storage.getUserAddress(id),
    "Адрес"
  ),
  async (req, res) => {
    await storage.deleteUserAddress(req.params.id);
    res.json({ message: "Адрес удалён" });
  }
);

router.put(
  "/:id/set-default",
  authenticateToken,
  requireOwnership(
    (id) => storage.getUserAddress(id),
    "Адрес"
  ),
  async (req, res) => {
    await storage.setDefaultAddress(req.userId!, req.params.id);
    res.json({ message: "Адрес установлен по умолчанию" });
  }
);

export default router;
