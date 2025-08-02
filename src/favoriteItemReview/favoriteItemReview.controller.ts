import { Request, Response, NextFunction } from 'express';
import { FavoriteItemReviewService } from './favoriteItemReview.service.js';

class FavoriteItemReviewController {
  private service = new FavoriteItemReviewService();

  addFavorite = async (req: Request, res: Response, next: NextFunction) => {
    const userId = 4; // 테스트
    const { reviewId } = req.body;

    try {
      await this.service.addFavorite(userId, reviewId);
      return res.status(201).json({ message: '찜 완료' });
    } catch (error) {
      next(new Error("AddFavoriteItemReviewError"));
    }
  };

  removeFavorite = async (req: Request, res: Response, next: NextFunction) => {
    const userId = 4;
    const reviewId = Number(req.params.reviewId);

    try {
      await this.service.removeFavorite(userId, reviewId);
      return res.status(200).json({ message: '찜 취소' });
    } catch (error) {
       next(new Error("DeleteFavoriteItemReviewError"));
    }
  };

  getFavorites = async (req: Request, res: Response, next: NextFunction) => {
    const userId = 4;

    try {
      const result = await this.service.getFavorites(userId);
      return res.status(200).json(result);
    } catch (error) {
       next(new Error("GetFavoriteItemReviewsError"));
    }
  };

  getFavoriteById = async (req: Request, res: Response, next: NextFunction) => {
    const userId = 4;
    const reviewId = Number(req.params.reviewId);

    try {
      const review = await this.service.getFavoriteById(userId, reviewId);
      return res.status(200).json(review);
    } catch (error) {
       next(new Error("GetFavoriteItemReviewByIdError"));
    }
  };
}

export default new FavoriteItemReviewController();
