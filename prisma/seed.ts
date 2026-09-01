import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // This seed deliberately creates public catalogue data only. Provision every human
  // account through a protected administrator workflow with a unique strong password.
  const services = [
    { name: 'IM/IV Injection Support', slug: 'im-iv-injections', description: 'Home administration of prescribed injections by a certified nurse.', basePrice: 350, priceUnit: 'visit', minimumDays: 1 },
    { name: 'Wound & Surgical Dressing', slug: 'wound-surgical-dressing', description: 'Sterile dressing changes for post-surgical wounds and lacerations.', basePrice: 450, priceUnit: 'visit', minimumDays: 1 },
    { name: 'Urinary Catheter Change', slug: 'urinary-catheter-change', description: 'Hygienic catheter replacement by a qualified nurse.', basePrice: 600, priceUnit: 'visit', minimumDays: 1 },
    { name: '24/7 Dedicated Nursing Care', slug: 'dedicated-24-7-nursing', description: 'Continuous live-in nursing care.', basePrice: 2500, priceUnit: 'day', minimumDays: 7 },
    { name: 'IV Infusion & Hydration Therapy', slug: 'iv-infusion-hydration', description: 'Setup and monitoring of prescribed infusions.', basePrice: 500, priceUnit: 'visit', minimumDays: 1 },
    { name: 'At-Home IVF Injection Support', slug: 'at-home-ivf-support', description: 'Scheduled hormone injection support.', basePrice: 400, priceUnit: 'visit', minimumDays: 1 },
    { name: 'Post-Surgical Nursing Care', slug: 'post-surgical-care', description: 'Recovery assistance and vitals monitoring.', basePrice: 1500, priceUnit: 'day', minimumDays: 3 },
    { name: 'Physiotherapy & Rehabilitation', slug: 'physiotherapy-rehab', description: 'Home-based rehabilitation support.', basePrice: 800, priceUnit: 'visit', minimumDays: 5 },
  ];

  for (const service of services) {
    await prisma.service.upsert({ where: { slug: service.slug }, update: service, create: service });
  }
}

main()
  .finally(async () => prisma.$disconnect());
