import { Router } from 'express';
import * as sharedChecklistController from '../controllers/sharedChecklistController';
// import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

// 공유된 체크리스트 전체 조회
router.get('/', sharedChecklistController.getAllSharedChecklists);

// 공유된 체크리스트 개별 조회
router.get('/:checklistId', sharedChecklistController.getSharedChecklistById);

// 체크리스트 공유
router.post('/:checklistId', sharedChecklistController.shareChecklist);

// 공유 해제
router.patch('/:checklistId', sharedChecklistController.unshareChecklist);

export default router;

// authenticate 나중에 추가될 미들웨어로, 사용자 인증을 처리합니다.