import express from 'express';
import favoriteItemReviewController from '../controllers/favoriteItemReview.Controller.js';

const router = express.Router();

// 후기 찜 추가
router.post('/', favoriteItemReviewController.addFavorite);

// 찜한 후기 전체 조회
router.get('/', favoriteItemReviewController.getFavorites);

// 찜한 후기 개별 조회
router.get('/:reviewId', favoriteItemReviewController.getFavoriteById);

// 찜한 후기 삭제
router.delete('/:reviewId', favoriteItemReviewController.removeFavorite);

export default router;

//authenticate 미들웨어를 사용하여 인증된 사용자만 접근할 수 있도록 설정 테스트로 지움