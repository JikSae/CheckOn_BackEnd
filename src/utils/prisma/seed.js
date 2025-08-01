const prisma = require('./index.js');

async function main() {
  // 1. 유저 생성
  const user = await prisma.user.create({
    data: {
      nickname: 'user1234',
      email: 'test1234@example.com',
      password: 'hashed-password', // 실제 앱에서는 해시된 비밀번호 사용
      birthDate: new Date('1995-01-01'),
      gender: 'MALE',
      authority: 'USER',
    },
  });

  // 2. 도시 생성
  const city = await prisma.city.create({
    data: {
      cityName: '오사카',
    },
  });

  // 3. 체크리스트 생성
  const checklist = await prisma.checklist.create({
    data: {
      userId: user.userId,
      title: '오사카  여행 체크리스트',
      travelType: 'ACTIVITY',
      cityId: city.cityId,
      travelStart: new Date('2025-08-01'),
      travelEnd: new Date('2025-08-10'),
    },
  });

  // 4. 카테고리 + 아이템 생성
  const category = await prisma.itemCategory.create({
    data: {
      categoryLabel: '치킨',
    },
  });

  const item = await prisma.item.create({
    data: {
      categoryId: category.categoryId,
      itemLabel: '후라이드 치킨',
      clickCount: 0,
    },
  });

  // 5. 체크리스트에 아이템 연결
  await prisma.checklistItem.create({
    data: {
      checklistId: checklist.checklistId,
      itemId: item.itemId,
    },
  });

  console.log('✅ Seed 데이터 생성 완료!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

//   await prisma.itemReview.create({
//   data: {
//     title: '보조배터리는 무조건 챙기세요',
//     content: '하루 종일 돌아다니다 보면 필수예요.',
//     checklistId: 4,  // 실제 존재하는 체크리스트 ID로
//     itemId: 1,        // 실제 존재하는 아이템 ID로
//     userId: 1,        // 테스트용 유저
//     likes: 0
//   }
// });
