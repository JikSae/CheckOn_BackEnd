import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import * as sharedChecklistService from '../services/sharedChecklistService';

// 공유된 체크리스트 전체 조회
export const getAllSharedChecklists = async (req: Request, res: Response) => {
  const { sort = 'likes' } = req.query as { sort?: string };

  try {
    const checklists = await sharedChecklistService.getAllSharedChecklists(sort);
    res.status(200).json(checklists);
  } catch (error: any) {
   throw new Error('ShareChecklistError');
  }
};

// 공유된 체크리스트 개별 조회
export const getSharedChecklistById = async (req: Request, res: Response) => {
  const { checklistId } = req.params;

  try {
    const checklist = await sharedChecklistService.getSharedChecklistById(Number(checklistId));

    if (!checklist) {
      throw new Error('shareChecklistError');
    }

    res.status(200).json(checklist);
  } catch (error: any) {
    throw new Error('ChecklistNotFound');
  }
};

// 체크리스트 공유
export const shareChecklist = async (req: Request, res: Response) => {
  const user = { userId: 7, authority: 'USER' }; // 테스트용
  const checklistId = 4; // 테스트용
  // const user = req.user;
  // const { checklistId } = req.body;

  try {
    const checklist = await sharedChecklistService.findChecklistById(checklistId);

    if (!checklist) {
      throw new Error('ChecklistNotFound');
    }

    if (checklist.deletedAt) {
      throw new Error('DeleteChecklistError');
    }

    if (checklist.isShared) {
      throw new Error('AlreadyShared');
    }

    const isOwner = checklist.userId === user.userId;
    const isAdmin = user.authority === 'ADMIN';

    if (!isOwner && !isAdmin) {
      throw new Error('AuthenticationError');
    }

    await sharedChecklistService.shareChecklist(checklistId);
    res.status(200).json({ message: '체크리스트가 공유되었습니다.' });

  } catch (error: any) {
    throw new Error('FailShared');
  }
};

// 체크리스트 공유 취소
export const unshareChecklist = async (req: Request, res: Response) => {
  const user = { userId: 7, authority: 'USER' }; // 테스트용
  const checklistId = 4; // 테스트용
  // const user = req.user;
  // const { checklistId } = req.params;

  try {
    const checklist = await sharedChecklistService.findChecklistById(checklistId);

    if (!checklist) {
      throw new Error("shareChecklistError");
    }

    if (checklist.deletedAt) {
      throw new Error("DeleteChecklistError");
    }

    if (!checklist.isShared) {
      throw new Error("AlreadyUnshared");
    }

    const isOwner = checklist.userId === user.userId;
    const isAdmin = user.authority === 'ADMIN';

    if (!isOwner && !isAdmin) {
      throw new Error('AuthenticationError');
    }

    await sharedChecklistService.unshareChecklist(checklistId);
    res.status(200).json({ message: '체크리스트 공유가 해제되었습니다.' });

  } catch (error: any) {
    throw new Error('FailUnshared');
  }
};
