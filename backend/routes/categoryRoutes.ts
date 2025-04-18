import { Router } from 'express';
import { getComplaintCategoryLabels } from '../utils/getEnumValues';
import { asyncHandler, CustomError } from '../middlewares/asyncHandler';

const router = Router();

router.get('/all', asyncHandler(async (req, res) => {
    const categories = getComplaintCategoryLabels();
    res.json(categories);
    if (!categories)
        throw new CustomError("No categories found", 404);
}));

export default router;