import { Request, Response } from 'express';
import { Prisma } from '@prisma/client'; 
import prisma from '../utils/prisma/index';
import * as itemReviewService from '../services/itemReviewService';

// 준비물 후기 작성
export const createItemReview = async (req: Request, res: Response) => {
  try {
    const { title, content, checklistId, itemId, image, userId } = req.body;

    const review = await itemReviewService.createItemReview({
      title,
      content,
      checklistId,
      itemId,
      image,
      userId,
    });

    res.status(201).json(review);
  } catch (err: any) {
    throw new Error("CreateItemReviewError");
  }
};

// 전체 준비물 후기 조회
export const getAllItemReviews = async (req: Request, res: Response) => {
  const { sort = 'likes', categoryId } = req.query;

  try {
    const orderBy: Prisma.ItemReviewOrderByWithRelationInput = 
      sort === 'recent'
        ? { createdAt: 'desc' }
        : { likes: 'desc' };

    const where: Prisma.ItemReviewWhereInput = {
      deletedAt: null,
      ...(categoryId ? {
        item: {
          categoryId: parseInt(categoryId as string),
        }
      } : {})
    };

    const reviews = await prisma.itemReview.findMany({
      where,
      orderBy,
      include: {
        user: { select: { nickname: true, profilePhoto: true } },
        item: {
          include: { itemCategory: true }
        }
      }
    });

    res.status(200).json(reviews);
  } catch (err: any) {
    throw new Error("ItemReviewNotFound");
  }
};

// 개별 준비물 후기 조회
export const getItemReviewById = async (req: Request, res: Response) => {
  const { reviewId } = req.params;

  try {
    const review = await prisma.itemReview.findUnique({
      where: {
        reviewId: parseInt(reviewId),
        deletedAt: null,
      },
      include: {
        user: {
          select: {
            nickname: true,
            profilePhoto: true,
          }
        },
        item: {
          include: {
            itemCategory: true,
          }
        },
        checklist: {
          select: {
            title: true,
            travelStart: true,
            travelEnd: true,
          }
        }
      }
    });

    if (!review) {
      throw new Error("ItemReviewNotFound");
    }

    res.status(200).json(review);
  } catch (error: any) {
      throw new Error("ItemReviewNotFound");
  }
};

// 좋아요 추가/취소
export const toggleFavoriteReview = async (req: Request, res: Response) => {
  const userId = 1 // 테스트용
  // const userId = (req as any).user?.userId; // 타입 정의된 미들웨어 없다면 any
  const reviewId = parseInt(req.params.reviewId);

  if (!userId) {
    throw new Error("UserNotFound");
  }

  try {
    const existing = await prisma.userFavoriteItemReview.findUnique({
      where: {
        userId_reviewId: {
          userId,
          reviewId,
        }
      }
    });

    if (existing) {
      await prisma.userFavoriteItemReview.delete({
        where: {
          userId_reviewId: {
            userId,
            reviewId
          }
        }
      });

      const review = await prisma.itemReview.findUnique({
        where: { reviewId },
        select: { likes: true }
      });

      if (review && review.likes > 0) {
        await prisma.itemReview.update({
          where: { reviewId },
          data: { likes: { decrement: 1 } }
        });
      }

      return res.status(200).json({ liked: false, message: '좋아요 취소됨' });
    } else {
      await prisma.userFavoriteItemReview.create({
        data: {
          userId,
          reviewId,
        }
      });

      await prisma.itemReview.update({
        where: { reviewId },
        data: { likes: { increment: 1 } }
      });

      return res.status(200).json({ liked: true, message: '좋아요 추가됨' });
    }
  } catch (error: any) {
    throw new Error("likesError");
  }
};

// 준비물 후기 수정
export const updateItemReview = async (req: Request, res: Response) => {
  const { reviewId } = req.params;
  const { title, content, image, checklistId, itemId } = req.body;
  const user = { userId: 1, authority: 'USER' }; // 테스트용

  try {
    const review = await prisma.itemReview.findUnique({
      where: { reviewId: Number(reviewId) },
      include: { user: true },
    });

    if (!review) {
      throw new Error("ItemReviewNotFound");
    }

    const isOwner = review.userId === user.userId;
    const isAdmin = user.authority === 'ADMIN';

    if (!isOwner && !isAdmin) {
     throw new Error("AuthenticationError"); 
    }

    const updated = await prisma.itemReview.update({
      where: { reviewId: Number(reviewId) },
      data: {
        title,
        content,
        image,
        checklistId: Number(checklistId),
        itemId: Number(itemId),
      },
    });

    return res.status(200).json({ message: '후기 수정 완료', review: updated });
  } catch (error: any) {
   throw new Error("patchItemReviewError");
  }
};

// 준비물 후기 삭제
export const deleteItemReview = async (req: Request, res: Response) => {
  const { reviewId } = req.params;
  const user = { userId: 4, authority: 'USER' }; // 테스트용

  try {
    const review = await prisma.itemReview.findUnique({
      where: { reviewId: Number(reviewId) },
    });

    if (!review || review.deletedAt) {
      throw new Error("ItemReviewNotFound");  
    }

    const isOwner = review.userId === user.userId;
    const isAdmin = user.authority === 'ADMIN';

    if (!isOwner && !isAdmin) {
      throw new Error("AuthenticationError");
    }

    await prisma.itemReview.update({
      where: { reviewId: Number(reviewId) },
      data: { deletedAt: new Date() },
    });

    return res.status(200).json({ message: '후기가 삭제되었습니다.' });
  } catch (error: any) {
    throw new Error("deleteItemReviewError");
  }
};
