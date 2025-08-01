const prisma = require('../utils/prisma/index.js');

async function main() {
  const userId = 23;  // 사용자 테이블에 실제 존재하는 user_id
  const cityId = 1;   // 실제 존재하는 city_id 확인 필요

  const checklist = await prisma.checklist.create({
    data: {
      title: '후기 테스트용 체크리스트',
      userId,
      cityId,
      travelStart: new Date('2025-08-01'),
      travelEnd: new Date('2025-08-05'),
      travelType: 'ACTIVITY',
    },
  });

  console.log('✅ 테스트 checklist 생성 완료:', checklist);
}

main()
  .catch((e) => {
    console.error('❌ 에러 발생:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
