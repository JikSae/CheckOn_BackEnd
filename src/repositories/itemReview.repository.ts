import prisma from '../lib/prisma.js';
import { Prisma } from '@prisma/client';
import { CreateItemReviewInput, ReviewQuery, UpdateItemReviewInput } from '../types/itemReview.js';

export class ItemReviewRepository {
  async create(data: CreateItemReviewInput) {
    return prisma.itemReview.create({ data });
  }

  async findAll(query: ReviewQuery) {
    const { sort = 'likes', categoryId } = query;

    const orderBy: Prisma.ItemReviewOrderByWithRelationInput =
      sort === 'recent' ? { createdAt: 'desc' } : { likes: 'desc' };

    const where: Prisma.ItemReviewWhereInput = {
      deletedAt: null,
      ...(categoryId ? { item: { categoryId: parseInt(categoryId) } } : {})
    };

    return prisma.itemReview.findMany({
      where,
      orderBy,
      include: {
        user: { select: { nickname: true, profilePhoto: true } },
        item: { include: { itemCategory: true } },
      }
    });
  }

  async findById(reviewId: number) {
    return prisma.itemReview.findUnique({
      where: { reviewId },
      include: {
        user: { select: { nickname: true, profilePhoto: true } },
        item: { include: { itemCategory: true } },
        checklist: { select: { title: true, travelStart: true, travelEnd: true } }
      }
    });
  }

  async update(reviewId: number, data: UpdateItemReviewInput) {
    return prisma.itemReview.update({ where: { reviewId }, data });
  }

  async softDelete(reviewId: number) {
    return prisma.itemReview.update({
      where: { reviewId },
      data: { deletedAt: new Date() }
    });
  }

  async findFavorite(userId: number, reviewId: number) {
    return prisma.userFavoriteItemReview.findUnique({
      where: { userId_reviewId: { userId, reviewId } }
    });
  }

  async addFavorite(userId: number, reviewId: number) {
    return prisma.userFavoriteItemReview.create({
      data: { userId, reviewId }
    });
  }

  async removeFavorite(userId: number, reviewId: number) {
    return prisma.userFavoriteItemReview.delete({
      where: { userId_reviewId: { userId, reviewId } }
    });
  }

  async increaseLikes(reviewId: number) {
    return prisma.itemReview.update({
      where: { reviewId },
      data: { likes: { increment: 1 } }
    });
  }

  async decreaseLikes(reviewId: number) {
    return prisma.itemReview.update({
      where: { reviewId },
      data: { likes: { decrement: 1 } }
    });
  }
}
