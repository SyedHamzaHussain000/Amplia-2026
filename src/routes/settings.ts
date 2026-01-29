import { Router } from 'express';
import {
  getTaxBrackets,
  updateTaxBrackets,
  getAllSettings,
  getSetting,
  upsertSetting,
  deleteSetting,
} from '../controllers/settings';
import { IsAuth } from '../middleware/isAuth';

const router = Router();

// Public routes (for mobile app)
router.get('/tax-brackets', getTaxBrackets);

// Protected routes (admin only)
router.get('/', IsAuth.admins, getAllSettings);
router.get('/:key', IsAuth.admins, getSetting);
router.post('/', IsAuth.admins, upsertSetting);
router.put('/tax-brackets', IsAuth.admins, updateTaxBrackets);
router.delete('/:key', IsAuth.admins, deleteSetting);

export default router;
