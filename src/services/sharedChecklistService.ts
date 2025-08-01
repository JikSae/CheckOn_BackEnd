import prisma from '../utils/prisma/index';

export const getAllSharedChecklists = async (sort: string) => {
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
};

export const getSharedChecklistById = async (checklistId: number) => {
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
          item: {
            include: {
              itemCategory: true,
            },
          },
        },
      },
    },
  });
};

export const findChecklistById = async (checklistId: number) => {
  return prisma.checklist.findUnique({
    where: { checklistId },
  });
};

export const shareChecklist = async (checklistId: number) => {
  return prisma.checklist.update({
    where: { checklistId },
    data: { isShared: true },
  });
};

export const unshareChecklist = async (checklistId: number) => {
  return prisma.checklist.update({
    where: { checklistId },
    data: { isShared: false },
  });
};
