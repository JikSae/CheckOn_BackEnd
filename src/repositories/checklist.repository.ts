import prisma from '../lib/prisma.js';

export default class SharedChecklistRepository {
  async getAllSharedChecklists(sort: string) {
    return prisma.checklist.findMany({
      where: {
        isShared: true,
        deletedAt: null,
      },
      orderBy: sort === 'recent' ? { createdAt: 'desc' } : { likes: 'desc' },
      include: {
        user: { select: { nickname: true, profilePhoto: true } },
        cities: true,
      },
    });
  }

  async getSharedChecklistById(checklistId: number) {
    return prisma.checklist.findUnique({
      where: {
        checklistId,
        isShared: true,
        deletedAt: null,
      },
      include: {
        user: { select: { nickname: true, profilePhoto: true } },
        cities: true,
        checklistItems: {
          include: {
            item: { include: { itemCategory: true } },
          },
        },
      },
    });
  }

  async findChecklistById(checklistId: number) {
    return prisma.checklist.findUnique({
      where: { checklistId },
    });
  }

  async shareChecklist(checklistId: number) {
    return prisma.checklist.update({
      where: { checklistId },
      data: { isShared: true },
    });
  }

  async unshareChecklist(checklistId: number) {
    return prisma.checklist.update({
      where: { checklistId },
      data: { isShared: false },
    });
  }
}
