import { FavoriteItemReviewRepository } from '../repositories/userFavoriteItemReview.repository.js';

export class FavoriteItemReviewService {
  private repo = new FavoriteItemReviewRepository();

  async addFavorite(userId: number, reviewId: number) {
    const existing = await this.repo.detailFavorite(userId, reviewId);
    if (existing) throw new Error('AlreadyFavorite');
    return this.repo.createFavorite(userId, reviewId);
  }

  
  async getFavoriteById(userId: number, reviewId: number) {
    const favorite = await this.repo.detailFavorite(userId, reviewId);

    if (!favorite) throw new Error("NotFavorite"); 

    return favorite.itemReview;
  }

  async removeFavorite(userId: number, reviewId: number) {
    const existing = await this.repo.detailFavorite(userId, reviewId);
    if (!existing) throw new Error('NotFavorite');
    return this.repo.deleteFavorite(userId, reviewId);
  }

  async getFavorites(userId: number) {
    return this.repo.findAllFavorites(userId);
  }
}


export default FavoriteItemReviewService;