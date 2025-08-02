import express, { Express } from "express";
import cors from "cors";
import itemReviewRouter from './itemReview/itemReview.router.js';
import favoriteItemReviewRouter from './favoriteItemReview/favoriteItemReview.router.js';
import sharedChecklistRouter from './sharedChecklist/sharedChecklist.router.js';
import { errorHandler } from './middlewares/error-handling.js';

const app: Express = express();
const PORT: 4000 = 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(errorHandler);
app.use(cors());

app.use('/item-reviews', itemReviewRouter);
app.use('/favorite-item-reviews', favoriteItemReviewRouter);
app.use('/shared-checklists', sharedChecklistRouter);


app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
