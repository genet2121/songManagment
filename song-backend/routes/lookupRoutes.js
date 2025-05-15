
import express from 'express';
import {
  createLookup,
  getLookups,
  deleteLookup,
  updateLookup
} from '../controllers/lookupController.js';

const router = express.Router();

router.post('/create', createLookup);


router.get('/getAll', getLookups);
router.put('/update/:id', updateLookup); 



router.delete('/:id', deleteLookup);

export default router;
