import express from 'express';
import dotenv from 'dotenv';
import itemReviewRouter from './routes/itemReviewRouter';
import favoriteItemReviewRouter from './routes/favoriteItemReviewRouter';
import sharedChecklistRouter from './routes/sharedChecklistRouter';
import { errorHandler } from './middlewares/errorMiddleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

app.use('/item-reviews', itemReviewRouter);
app.use('/favorite-item-reviews', favoriteItemReviewRouter);
app.use('/shared-checklists', sharedChecklistRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`${PORT} 포트로 서버가 열렸어요!`);
});
