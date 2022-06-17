import express from 'express';
import { getWebHook, postWebHook } from './controller.facebook';

const router = express.Router();

router.get('/', getWebHook);
router.post('/', postWebHook);

export default router;