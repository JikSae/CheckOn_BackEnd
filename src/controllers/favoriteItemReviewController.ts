import { Request, Response } from 'express';
import prisma from '../utils/prisma/index';
import * as favoriteItemReviewService from '../services/favoriteItemReviewService';



// POST /favorite-item-reviews - 찜하기
export const addFavoriteItemReview = async (req: Request, res: Response) => {
// const userId = (req as AuthenticatedRequest).user?.userId;
  const userId = 4; // 임시 하드코딩 (테스트용)
  // const { reviewId } = req.body;
  const reviewId = 10; // 임시 하드코딩 (테스트용)

  if (!userId) {
    throw new Error('UserNotFound');
  }

  try {
    await favoriteItemReviewService.addFavorite(userId, Number(reviewId));
    res.status(201).json({ message: '후기를 찜했습니다.' });
  } catch (error: any) {
    throw new Error('AddFavoriteItemReviewError');
  }
};

// GET /favorite-item-reviews - 찜한 준비물 후기 전체 조회
export const getFavoriteItemReviews = async (req: Request, res: Response) => {
// const userId = (req as AuthenticatedRequest).user?.userId;
  const userId = 4; // 임시 하드코딩 (테스트용)

  if (!userId) {
    throw new Error('UserNotFound');
  }

  try {
    const reviews = await favoriteItemReviewService.getAllFavorites(userId);
    res.status(200).json(reviews);
  } catch (error: any) {
    throw new Error('GetFavoriteItemReviewsError');
  }
};

// GET /favorite-item-reviews/:reviewId - 찜한 준비물 후기 상세 조회
export const getFavoriteItemReviewById = async (req: Request, res: Response) => {
// const userId = (req as AuthenticatedRequest).user?.userId;
  const userId = 4; // 임시 하드코딩 (테스트용)
  const { reviewId } = req.params;

  try {
    const review = await favoriteItemReviewService.getFavoriteById(userId, Number(reviewId));

    if (!review) {
      throw new Error('GetFavoriteItemReviewsError');
    }

    res.status(200).json(review);
  } catch (error: any) {
    throw new Error('GetFavoriteItemReviewByIdError');
  }
};

// DELETE /favorite-item-reviews/:reviewId - 찜한 준비물 후기 삭제
export const deleteFavoriteItemReviews = async (req: Request, res: Response) => {
  // const userId = req.user?.userId;
  const userId = 4; // 임시 하드코딩 (테스트용)
  const { reviewId } = req.params;

  try {
    await favoriteItemReviewService.removeFavorite(userId, Number(reviewId));
    res.status(200).json({ message: '찜이 취소되었습니다.' });
  } catch (error: any) {
    throw new Error('DeleteFavoriteItemReviewError');
  }
};
