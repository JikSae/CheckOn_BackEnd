import prisma from '../utils/prisma/index';

export const addFavorite = async (userId: number, reviewId: number) => {
  const existing = await prisma.userFavoriteItemReview.findUnique({
    where: {
      userId_reviewId: { userId, reviewId },
    },
  });

  if (existing && !existing.deletedAt) {
    throw new Error('AlreadyFavorite');
  }

  if (existing && existing.deletedAt) {
    return prisma.userFavoriteItemReview.update({
      where: { userId_reviewId: { userId, reviewId } },
      data: { deletedAt: null },
    });
  }

  return prisma.userFavoriteItemReview.create({
    data: { userId, reviewId },
  });
};

export const removeFavorite = async (userId: number, reviewId: number) => {
  const existing = await prisma.userFavoriteItemReview.findUnique({
    where: {
      userId_reviewId: { userId, reviewId },
    },
  });

  if (!existing || existing.deletedAt) {
    throw new Error('NotFavorite');
  }

  return prisma.userFavoriteItemReview.update({
    where: { userId_reviewId: { userId, reviewId } },
    data: { deletedAt: new Date() },
  });
};

export const getAllFavorites = async (userId: number) => {
  const favorites = await prisma.userFavoriteItemReview.findMany({
    where: {
      userId,
      deletedAt: null,
      itemReview: {
        deletedAt: null,
      },
    },
    include: {
      itemReview: {
        include: {
          user: {
            select: {
              nickname: true,
              profilePhoto: true,
            },
          },
          item: {
            include: {
              itemCategory: true,
            },
          },
        },
      },
    },
  });

  return favorites;
};

export const getFavoriteById = async (userId: number, reviewId: number) => {
  const favorite = await prisma.userFavoriteItemReview.findUnique({
    where: {
      userId_reviewId: { userId, reviewId },
    },
    include: {
      itemReview: {
        include: {
          user: {
            select: { nickname: true, profilePhoto: true },
          },
          item: {
            include: { itemCategory: true },
          },
          checklist: {
            select: {
              title: true,
              travelStart: true,
              travelEnd: true,
            },
          },
        },
      },
    },
  });

  return favorite?.deletedAt ? null : favorite?.itemReview;
};
