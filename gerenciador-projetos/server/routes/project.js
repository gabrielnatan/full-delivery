import { Router } from 'express';
import fs from 'node:fs/promises';
import { CONFIG_FILE } from '../lib/paths.js';

const router = Router();

async function readConfig() {
  try {
    return JSON.parse(await fs.readFile(CONFIG_FILE, 'utf-8'));
  } catch (err) {
    if (err.code === 'ENOENT') return {};
    throw err;
  }
}

// GET /api/project — metadados do projeto (config/project.json)
router.get('/', async (req, res, next) => {
  try {
    res.json(await readConfig());
  } catch (err) {
    next(err);
  }
});

// PATCH /api/project — mescla campos e grava (usado pelo Onboarding Wizard)
router.patch('/', async (req, res, next) => {
  try {
    const current = await readConfig();
    const merged = { ...current, ...req.body };
    await fs.writeFile(CONFIG_FILE, JSON.stringify(merged, null, 2) + '\n', 'utf-8');
    res.json(merged);
  } catch (err) {
    next(err);
  }
});

export default router;
