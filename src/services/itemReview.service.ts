import { ItemReviewRepository } from '../repositories/itemReview.repository.js';
import { CreateItemReviewInput, ReviewQuery, UpdateItemReviewInput } from '../types/itemReview.js';

export class ItemReviewService {
  private repo = new ItemReviewRepository();

  async createItemReview(data: CreateItemReviewInput) {
    return this.repo.create(data);
  }

  async getAllItemReviews(query: ReviewQuery) {
    return this.repo.findAll(query);
  }

  async getItemReviewById(reviewId: number) {
    const review = await this.repo.findById(reviewId);
    if (!review) throw new Error('ItemReviewNotFound');
    return review;
  }

  async toggleFavorite(userId: number, reviewId: number) {
    const existing = await this.repo.findFavorite(userId, reviewId);

    if (existing) {
      await this.repo.removeFavorite(userId, reviewId);
      await this.repo.decreaseLikes(reviewId);
      return { liked: false, message: '좋아요 취소됨' };
    } else {
      await this.repo.addFavorite(userId, reviewId);
      await this.repo.increaseLikes(reviewId);
      return { liked: true, message: '좋아요 추가됨' };
    }
  }

  async updateItemReview(reviewId: number, data: UpdateItemReviewInput, user: { userId: number; authority: string }) {
    const review = await this.repo.findById(reviewId);
    if (!review) throw new Error("ItemReviewNotFound");

    const isOwner = review.userId === user.userId;
    const isAdmin = user.authority === 'ADMIN';

    if (!isOwner && !isAdmin) throw new Error("AuthenticationError");

    return this.repo.update(reviewId, data);
  }

  async deleteItemReview(reviewId: number, user: { userId: number; authority: string }) {
    const review = await this.repo.findById(reviewId);
    if (!review || review.deletedAt) throw new Error("ItemReviewNotFound");

    const isOwner = review.userId === user.userId;
    const isAdmin = user.authority === 'ADMIN';
    if (!isOwner && !isAdmin) throw new Error("AuthenticationError");

    return this.repo.softDelete(reviewId);
  }
}
