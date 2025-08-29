import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export const getWorlds = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const worlds = await prisma.world.findMany({
      where: {
        userId: req.user!.userId,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    res.json(worlds);
  } catch (error) {
    console.error('Get worlds error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createWorld = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, description } = req.body;

    if (!name) {
      res.status(400).json({ error: 'World name is required' });
      return;
    }

    const world = await prisma.world.create({
      data: {
        name,
        description: description || '',
        userId: req.user!.userId,
      },
    });

    res.status(201).json(world);
  } catch (error) {
    console.error('Create world error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getWorldById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const world = await prisma.world.findFirst({
      where: {
        id,
        userId: req.user!.userId,
      },
      include: {
        characters: {
          orderBy: { createdAt: 'desc' },
        },
        locations: {
          orderBy: { createdAt: 'desc' },
        },
        events: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!world) {
      res.status(404).json({ error: 'World not found' });
      return;
    }

    res.json(world);
  } catch (error) {
    console.error('Get world error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateWorld = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, isPublic } = req.body;

    const world = await prisma.world.findFirst({
      where: {
        id,
        userId: req.user!.userId,
      },
    });

    if (!world) {
      res.status(404).json({ error: 'World not found' });
      return;
    }

    const updatedWorld = await prisma.world.update({
      where: { id },
      data: {
        name: name || world.name,
        description: description !== undefined ? description : world.description,
        isPublic: isPublic !== undefined ? isPublic : world.isPublic,
      },
    });

    res.json(updatedWorld);
  } catch (error) {
    console.error('Update world error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteWorld = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const world = await prisma.world.findFirst({
      where: {
        id,
        userId: req.user!.userId,
      },
    });

    if (!world) {
      res.status(404).json({ error: 'World not found' });
      return;
    }

    await prisma.world.delete({
      where: { id },
    });

    res.json({ message: 'World deleted successfully' });
  } catch (error) {
    console.error('Delete world error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
