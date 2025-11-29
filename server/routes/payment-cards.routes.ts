import { Router } from "express";
import { storage } from "../storage";
import { authenticateToken } from "../auth";
import { createPaymentCardSchema } from "@shared/schema";
import { requireOwnership } from "../middleware/resourceOwnership";
import { z } from "zod";

const router = Router();

router.get("/", authenticateToken, async (req, res) => {
  const cards = await storage.getUserPaymentCards(req.userId!);
  res.json(cards);
});

router.post("/", authenticateToken, async (req, res) => {
  try {
    const data = createPaymentCardSchema.parse(req.body);

    const card = await storage.createUserPaymentCard({
      ...data,
      userId: req.userId!,
    });

    if (data.isDefault) {
      await storage.setDefaultPaymentCard(req.userId!, card.id);
    }

    res.json(card);
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

router.delete(
  "/:id",
  authenticateToken,
  requireOwnership(
    (id) => storage.getUserPaymentCard(id),
    "Карта"
  ),
  async (req, res) => {
    await storage.deleteUserPaymentCard(req.params.id);
    res.json({ message: "Карта удалена" });
  }
);

router.put(
  "/:id/set-default",
  authenticateToken,
  requireOwnership(
    (id) => storage.getUserPaymentCard(id),
    "Карта"
  ),
  async (req, res) => {
    await storage.setDefaultPaymentCard(req.userId!, req.params.id);
    res.json({ message: "Карта установлена по умолчанию" });
  }
);

export default router;
