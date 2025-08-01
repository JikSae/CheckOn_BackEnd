import prisma from '../utils/prisma/index';

interface CreateItemReviewInput {
  title: string;
  content: string;
  checklistId: number;
  itemId: number;
  image?: string | null;
  userId: number;
}

export const createItemReview = async ({
  title,
  content,
  checklistId,
  itemId,
  image,
  userId,
}: CreateItemReviewInput) => {
  return await prisma.itemReview.create({
    data: {
      title,
      content,
      checklistId,
      itemId,
      image,
      userId,
    },
  });
};
