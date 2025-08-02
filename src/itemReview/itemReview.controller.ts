import { Request, Response, NextFunction } from 'express';
import { ItemReviewService } from './itemReview.service.js';
import type { ReviewQuery } from '../types/itemReview.js'; 

class ItemReviewController {
  private service = new ItemReviewService();

createItemReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, content, checklistId, itemId, userId } = req.body;
    const image = req.file?.filename ?? null;

    const review = await this.service.createItemReview({
      title,
      content,
      checklistId: Number(checklistId),
      itemId: Number(itemId),
      image,
      userId: Number(userId),
    });

    res.status(201).json(review);
  } catch (error) {
    next(new Error("CreateItemReviewError"));
  }
};


getAllItemReviews = async (req: Request, res: Response, next: NextFunction) => {
  const { sort = 'likes', categoryId } = req.query as ReviewQuery;
  try {
    const result = await this.service.getAllItemReviews({ sort, categoryId });
    res.status(200).json(result);
  } catch (error) {
    next(new Error("ItemReviewNotFound"));
  }
};


  getItemReviewById = async (req: Request, res: Response, next: NextFunction) => {
    const reviewId = Number(req.params.reviewId);
    try {
      const review = await this.service.getItemReviewById(reviewId);
      res.status(200).json(review);
    } catch (error) {
      next(new Error("ItemReviewNotFound"));
    }
  };

  toggleFavoriteReview = async (req: Request, res: Response, next: NextFunction) => {
    const userId = 1; // 테스트용
    const reviewId = Number(req.params.reviewId);
    try {
      const result = await this.service.toggleFavorite(userId, reviewId);
      res.status(200).json(result);
    } catch (error) {
      next(new Error("likesError"));
    }
  };

  updateItemReview = async (req: Request, res: Response, next: NextFunction) => {
    const reviewId = Number(req.params.reviewId);
    const { title, content, image, checklistId, itemId } = req.body;
    const user = { userId: 1, authority: 'USER' }; // 테스트용

    try {
      const updated = await this.service.updateItemReview(reviewId, { title, content, image, checklistId, itemId }, user);
      res.status(200).json({ message: '후기 수정 완료', review: updated });
    } catch (error) {
      next(new Error("patchItemReviewError"));
    }
  };

  deleteItemReview = async (req: Request, res: Response, next: NextFunction) => {
    const reviewId = Number(req.params.reviewId);
    const user = { userId: 4, authority: 'USER' }; // 테스트용

    try {
      await this.service.deleteItemReview(reviewId, user);
      res.status(200).json({ message: '후기가 삭제되었습니다.' });
    } catch (error) {
      next(new Error("deleteItemReviewError"));
    }
  };
}

export default new ItemReviewController();
