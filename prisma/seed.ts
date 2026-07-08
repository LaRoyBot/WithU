import { PrismaClient } from '@prisma/client';
import { createHash } from 'crypto';

const prisma = new PrismaClient();

function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex');
}

async function main() {
  console.log('Starting seed...');

  // 1. Seed Admin User
  const adminEmail = 'admin@neethanursing.com';
  const existingAdmin = await prisma.adminUser.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    await prisma.adminUser.create({
      data: {
        email: adminEmail,
        name: 'Neetha Coordinator',
        passwordHash: hashPassword('admin123'),
        role: 'ADMIN',
      },
    });
    console.log('Created admin account: admin@neethanursing.com / admin123');
  }

  // 2. Seed Services
  const services = [
    {
      name: 'IM/IV Injection Support',
      slug: 'im-iv-injections',
      description: 'Administration of intramuscular or intravenous injections by a certified nurse at your home.',
      basePrice: 350.0,
      priceUnit: 'visit',
      minimumDays: 1,
    },
    {
      name: 'Wound & Surgical Dressing',
      slug: 'wound-surgical-dressing',
      description: 'Sterile dressing changes for post-surgical wounds, diabetic ulcers, or other lacerations.',
      basePrice: 450.0,
      priceUnit: 'visit',
      minimumDays: 1,
    },
    {
      name: 'Urinary Catheter Change',
      slug: 'urinary-catheter-change',
      description: 'Hygienic insertion, removal, or replacement of urinary catheters.',
      basePrice: 600.0,
      priceUnit: 'visit',
      minimumDays: 1,
    },
    {
      name: '24/7 Dedicated Nursing Care',
      slug: 'dedicated-24-7-nursing',
      description: 'Continuous 24-hour round-the-clock shift nursing for critical or elderly patients.',
      basePrice: 2500.0,
      priceUnit: 'day',
      minimumDays: 7,
    },
    {
      name: 'IV Infusion & Hydration Therapy',
      slug: 'iv-infusion-hydration',
      description: 'Setup and monitoring of intravenous fluids, vitamins, or hydration therapy at home.',
      basePrice: 500.0,
      priceUnit: 'visit',
      minimumDays: 1,
    },
    {
      name: 'At-Home IVF Injection Support',
      slug: 'at-home-ivf-support',
      description: 'Scheduled daily hormone injections for IVF cycles administered timely by a nurse.',
      basePrice: 400.0,
      priceUnit: 'visit',
      minimumDays: 1,
    },
    {
      name: 'Post-Surgical Nursing Care',
      slug: 'post-surgical-care',
      description: '12-hour or 24-hour recovery assistance including vitals monitoring, medications, and support.',
      basePrice: 1500.0,
      priceUnit: 'day',
      minimumDays: 3,
    },
    {
      name: 'Physiotherapy & Rehabilitation',
      slug: 'physiotherapy-rehab',
      description: 'Home-based physical therapy exercises for stroke recovery, joint replacement, or mobility issues.',
      basePrice: 800.0,
      priceUnit: 'visit',
      minimumDays: 5,
    },
  ];

  for (const s of services) {
    const existing = await prisma.service.findUnique({
      where: { slug: s.slug },
    });
    if (!existing) {
      await prisma.service.create({ data: s });
      console.log(`Created service: ${s.name}`);
    } else {
      // Update existing service
      await prisma.service.update({
        where: { slug: s.slug },
        data: s,
      });
      console.log(`Updated service: ${s.name}`);
    }
  }

  // 3. Seed Mock Nurses for testing
  const nurses = [
    {
      name: 'Sister Anjali Kumari',
      phone: '+919876543210',
      gender: 'Female',
      qualification: 'GNM (General Nursing and Midwifery)',
      experienceYears: 6,
      status: 'ACTIVE',
      skills: 'im-iv-injections,wound-surgical-dressing,at-home-ivf-support,post-surgical-care',
      baseLocation: 'Lingampally, Hyderabad',
    },
    {
      name: 'Brother Raju Prasad',
      phone: '+919876543211',
      gender: 'Male',
      qualification: 'B.Sc. Nursing',
      experienceYears: 4,
      status: 'ACTIVE',
      skills: 'im-iv-injections,wound-surgical-dressing,urinary-catheter-change,physiotherapy-rehab',
      baseLocation: 'Kondapur, Hyderabad',
    },
    {
      name: 'Sister Neeraja Reddy',
      phone: '+919876543212',
      gender: 'Female',
      qualification: 'ANM (Auxiliary Nurse Midwifery)',
      experienceYears: 8,
      status: 'ACTIVE',
      skills: 'dedicated-24-7-nursing,post-surgical-care,iv-infusion-hydration',
      baseLocation: 'Miyapur, Hyderabad',
    },
  ];

  for (const n of nurses) {
    const existing = await prisma.nurse.findUnique({
      where: { phone: n.phone },
    });
    if (!existing) {
      await prisma.nurse.create({ data: n });
      console.log(`Created nurse: ${n.name}`);
    }
  }

  console.log('Seed completed successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
