const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('--- Seeding PujaConnect Database ---');

  // Clean existing data
  await prisma.auditLog.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.supportTicket.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.partnerEarnings.deleteMany({});
  await prisma.refundRecord.deleteMany({});
  await prisma.paymentTransaction.deleteMany({});
  await prisma.bookingStatusHistory.deleteMany({});
  await prisma.booking.deleteMany({});
  await prisma.servicePackage.deleteMany({});
  await prisma.ritual.deleteMany({});
  await prisma.ritualCategory.deleteMany({});
  await prisma.verificationDocument.deleteMany({});
  await prisma.panditAvailability.deleteMany({});
  await prisma.panditProfile.deleteMany({});
  await prisma.customerProfile.deleteMany({});
  await prisma.user.deleteMany({});

  const defaultPasswordHash = await bcrypt.hash('Password@123', 10);
  const adminPasswordHash = await bcrypt.hash('Admin@1234', 10);

  // 1. Create Admin
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@pujaconnect.com',
      passwordHash: adminPasswordHash,
      name: 'Operations Administrator',
      phone: '9849012345',
      role: 'ADMIN',
    },
  });

  // 2. Create Customers
  const customerUser = await prisma.user.create({
    data: {
      email: 'customer@pujaconnect.com',
      passwordHash: defaultPasswordHash,
      name: 'Ananya & Rajesh Sharma',
      phone: '9849123456',
      role: 'CUSTOMER',
      customerProfile: {
        create: {
          address: 'Flat 402, Aditya Sunshine Apartments, Madhapur',
          city: 'Hyderabad',
          locality: 'Madhapur',
          pincode: '500081',
          preferredLanguages: 'Telugu, English, Hindi',
        },
      },
    },
  });

  // 3. Create Pandit 1 - Approved Senior Vedic Priest
  const pandit1User = await prisma.user.create({
    data: {
      email: 'pandit.shastri@pujaconnect.com',
      passwordHash: defaultPasswordHash,
      name: 'Pt. Rama Shastri',
      phone: '9849234567',
      role: 'PANDIT',
      panditProfile: {
        create: {
          bio: 'Born in Rajahmundry, Pt. Rama Shastri holds a Veda Praveena title from Tirumala Veda Pathashala with 18+ years of expertise conducting Griha Pravesh, Satyanarayan, and Vastu Havans according to Krishna Yajurveda tradition.',
          experienceYears: 18,
          traditions: 'Krishna Yajurveda, Smartha, Vastu Shastra',
          languages: 'Telugu, Sanskrit, Hindi',
          city: 'Hyderabad',
          serviceLocalities: 'Kukatpally, Madhapur, Gachibowli, Miyapur, Kondapur, Hitec City',
          samagriProvided: true,
          verificationStatus: 'APPROVED',
          rating: 4.9,
          reviewCount: 38,
          isAvailable: true,
          travelRadiusKm: 30,
          documents: {
            create: [
              {
                documentType: 'AADHAAR',
                documentNumber: 'XXXX-XXXX-4921',
                fileUrl: '/mock/docs/aadhaar_shastri.pdf',
                status: 'VERIFIED',
                adminNotes: 'Government ID identity verified against UIDAI database',
              },
              {
                documentType: 'PRIESTHOOD_CERTIFICATE',
                documentNumber: 'TTD-VP-2006-118',
                fileUrl: '/mock/docs/veda_praveena_certificate.pdf',
                status: 'VERIFIED',
                adminNotes: 'Tirumala Veda Pathashala certification verified',
              },
            ],
          },
        },
      },
    },
    include: { panditProfile: true },
  });

  // Pandit 2 - Approved Vaishnava Priest
  const pandit2User = await prisma.user.create({
    data: {
      email: 'pandit.narasimha@pujaconnect.com',
      passwordHash: defaultPasswordHash,
      name: 'Pt. Narasimha Murthy',
      phone: '9849345678',
      role: 'PANDIT',
      panditProfile: {
        create: {
          bio: 'Specialist in Pancharatra Agama, Satyanarayan Swamy Puja, Sudarshana Homam, and Wedding Rites. Fluent in explaining each Vedic mantra in contemporary Telugu and English.',
          experienceYears: 12,
          traditions: 'Vaishnava, Pancharatra Agama, Vedic',
          languages: 'Telugu, Kannada, English, Hindi',
          city: 'Hyderabad',
          serviceLocalities: 'Banjara Hills, Jubilee Hills, Kondapur, Begumpet, Secunderabad',
          samagriProvided: true,
          verificationStatus: 'APPROVED',
          rating: 4.8,
          reviewCount: 24,
          isAvailable: true,
          travelRadiusKm: 25,
          documents: {
            create: [
              {
                documentType: 'AADHAAR',
                documentNumber: 'XXXX-XXXX-7128',
                fileUrl: '/mock/docs/aadhaar_narasimha.pdf',
                status: 'VERIFIED',
                adminNotes: 'Aadhaar ID verified',
              },
            ],
          },
        },
      },
    },
    include: { panditProfile: true },
  });

  // Pandit 3 - Pending Verification
  const pandit3User = await prisma.user.create({
    data: {
      email: 'pandit.raghav@pujaconnect.com',
      passwordHash: defaultPasswordHash,
      name: 'Pt. Raghavendra Acharya',
      phone: '9849456789',
      role: 'PANDIT',
      panditProfile: {
        create: {
          bio: 'Young dynamic Vedic scholar specializing in Rudrabhishekam, Navagraha Shanti, and festive ceremonies with clean Sanskrit pronunciations.',
          experienceYears: 5,
          traditions: 'Rigveda, Smartha',
          languages: 'Telugu, Sanskrit, Hindi',
          city: 'Hyderabad',
          serviceLocalities: 'Dilsukhnagar, Ameerpet, Secunderabad, Uppal',
          samagriProvided: true,
          verificationStatus: 'PENDING_REVIEW',
          rating: 5.0,
          reviewCount: 0,
          isAvailable: true,
          travelRadiusKm: 20,
          documents: {
            create: [
              {
                documentType: 'AADHAAR',
                documentNumber: 'XXXX-XXXX-8932',
                fileUrl: '/mock/docs/aadhaar_raghav.pdf',
                status: 'PENDING',
                adminNotes: 'Awaiting admin document verification',
              },
            ],
          },
        },
      },
    },
  });

  // 4. Ritual Categories
  const catHousewarming = await prisma.ritualCategory.create({
    data: {
      name: 'Housewarming & Vastu',
      slug: 'housewarming-vastu',
      description: 'Sacred pujas to invite peace, positivity, and divine blessings into a new home or workplace.',
      icon: 'Home',
      displayOrder: 1,
    },
  });

  const catFestive = await prisma.ritualCategory.create({
    data: {
      name: 'Deity & Festive Pujas',
      slug: 'festive-deities',
      description: 'Traditional pujas for Lord Satyanarayan, Lord Ganesha, and Goddess Lakshmi.',
      icon: 'Sun',
      displayOrder: 2,
    },
  });

  const catHavan = await prisma.ritualCategory.create({
    data: {
      name: 'Havan & Graha Shanti',
      slug: 'havan-graha-shanti',
      description: 'Sacred fire ceremonies and planetary pacifications for health, career, and family harmony.',
      icon: 'Flame',
      displayOrder: 3,
    },
  });

  const catMilestone = await prisma.ritualCategory.create({
    data: {
      name: 'Life Milestones (Samskaras)',
      slug: 'milestone-samskaras',
      description: 'Vedic samskaras for child naming, sacred ceremonies, and weddings.',
      icon: 'HeartHandshake',
      displayOrder: 4,
    },
  });

  // 5. Rituals & Service Packages
  // A. Griha Pravesh
  const ritualGriha = await prisma.ritual.create({
    data: {
      categoryId: catHousewarming.id,
      name: 'Griha Pravesh Puja',
      slug: 'griha-pravesh',
      description: 'The Vedic housewarming ceremony invokes Lord Ganesha, Vastu Purusha, and the Navagrahas to cleanse the new premises, eliminate residual negative energies, and bless the inhabitants with prosperity, health, and peace.',
      shortDescription: 'Auspicous housewarming ceremony with Vastu Shanti, Go Puja & Navagraha Havan',
      durationHours: 3.5,
      languages: 'Telugu, Sanskrit, Hindi, Kannada, Tamil',
      traditions: 'Vedic, Smartha, Vaishnava',
      samagriChecklist: JSON.stringify([
        'Turmeric (Haldi), Kumkum, Chandan',
        'Coconuts (5 pcs), Betel Leaves (25 pcs), Supari',
        'Navadhanya (9 grains mixture)',
        'Dry coconut kopra for Homa (4 halves)',
        'Havan samagri herbs, Cow ghee (500g)',
        'Mango leaves, Toran for doorway',
        'Copper/Brass Kalash, Red and Yellow cloth pieces',
        'Camphor, Agarbatti, Dhoop sticks'
      ]),
      priestCountRequired: 1,
      basePrice: 5500,
      isPublished: true,
      imageUrl: '/images/griha_pravesh.jpg',
      packages: {
        create: [
          {
            name: 'Basic Vedic Griha Pravesh',
            tier: 'BASIC',
            description: 'Essential housewarming rites performed by a verified Vedic pandit. Customer provides all samagri.',
            inclusions: JSON.stringify([
              'Vighneshwara Puja & Punyahavachanam',
              'Milk boiling ceremony guidance',
              'Vastu Purusha Puja & Kalash Sthapana',
              'Aarti and Ashirvachanam blessings'
            ]),
            exclusions: JSON.stringify([
              'Puja samagri (arranged by customer)',
              'Havan firewood and cow ghee',
              'Navagraha Havan'
            ]),
            panditFee: 4500,
            samagriCost: 0,
            travelCost: 300,
            platformFee: 450,
            taxes: 81,
            totalAmount: 5331,
            samagriOption: 'CUSTOMER_ARRANGED',
          },
          {
            name: 'Standard Griha Pravesh with Full Samagri',
            tier: 'STANDARD',
            description: 'Comprehensive ceremony including complete premium herbal samagri, Navadhanya, dry coconut, and Havan setup brought by the pandit.',
            inclusions: JSON.stringify([
              'Complete 45-item premium samagri kit brought by pandit',
              'Gau Puja (Cow Puja prayer)',
              'Vastu Shanti & Navagraha Havan',
              'Dwar Puja (Threshold cleansing)',
              'Satyanarayan Katha (condensed blessing)',
              'Maha Mangala Aarti & Sacred Raksha bandhan'
            ]),
            exclusions: JSON.stringify([
              'Fresh perishable fruits and flowers (family arranged)'
            ]),
            panditFee: 6500,
            samagriCost: 2200,
            travelCost: 300,
            platformFee: 650,
            taxes: 117,
            totalAmount: 9767,
            samagriOption: 'FULL_SAMAGRI_INCLUDED',
          },
          {
            name: 'Grand Vastu Griha Pravesh (2 Priests)',
            tier: 'PREMIUM',
            description: 'Elaborate traditional housewarming performed by 2 senior Vedic priests with full Maha Navagraha Homa, Sri Sukta Homa, and Veda Parayanam.',
            inclusions: JSON.stringify([
              '2 Senior Verified Vedic Priests',
              'Comprehensive 60+ item herbal Samagri & Havan kit',
              'Full Veda Parayanam recitation',
              'Navagraha Homa with authentic firewood & pure cow ghee',
              'Vastu Bali & Dikpalaka Puja',
              'Panchamrit Abhishek on family deities',
              'Detailed personalized family gotra blessings'
            ]),
            exclusions: JSON.stringify([]),
            panditFee: 12000,
            samagriCost: 3500,
            travelCost: 600,
            platformFee: 1200,
            taxes: 216,
            totalAmount: 17516,
            samagriOption: 'FULL_SAMAGRI_INCLUDED',
          },
        ],
      },
    },
    include: { packages: true },
  });

  // B. Satyanarayan Puja
  const ritualSatyanarayan = await prisma.ritual.create({
    data: {
      categoryId: catFestive.id,
      name: 'Satyanarayan Puja',
      slug: 'satyanarayan-puja',
      description: 'Sri Satyanarayana Swami Puja is one of the most auspicious ceremonies in Hindu traditions. It is performed for family well-being, success in endeavors, on housewarming occasions, or on monthly Purnima.',
      shortDescription: 'Sacred narrative ritual of Lord Vishnu for family prosperity & auspiciousness',
      durationHours: 2.5,
      languages: 'Telugu, Hindi, Sanskrit, Kannada',
      traditions: 'Vedic, Vaishnava, Smartha',
      samagriChecklist: JSON.stringify([
        'Satyanarayan Idol / Photo',
        'Sooji / Semolina, Sugar, Pure Cow Ghee, Milk for Sheera prasad',
        'Panchamrit: Milk, Curd, Honey, Ghee, Sugar',
        '4 Banana stalks for Mandap',
        'Tulsi leaves, Betel leaves, Supari, Coconuts (3 pcs)',
        'Flowers, Garlands, Turmeric, Kumkum'
      ]),
      priestCountRequired: 1,
      basePrice: 3200,
      isPublished: true,
      imageUrl: '/images/satyanarayan.jpg',
      packages: {
        create: [
          {
            name: 'Standard Satyanarayan Puja with Samagri',
            tier: 'STANDARD',
            description: 'Complete 5-chapter sacred katha recitation, Vighneshwara Puja, Navagraha invocation, and Maha Aarti with all puja samagri provided.',
            inclusions: JSON.stringify([
              'Full Puja Samagri Kit provided by pandit',
              'Ganesh Puja & Kalash Puja',
              'Recitation of all 5 chapters of Satyanarayan Katha',
              'Panchamrit Abhishek & Archana',
              'Maha Aarti & distribution of sacred Charanamrit'
            ]),
            exclusions: JSON.stringify([
              'Cooked Prasad / Sheera (made fresh by family in home kitchen)'
            ]),
            panditFee: 3200,
            samagriCost: 1200,
            travelCost: 300,
            platformFee: 320,
            taxes: 58,
            totalAmount: 5078,
            samagriOption: 'FULL_SAMAGRI_INCLUDED',
          },
        ],
      },
    },
    include: { packages: true },
  });

  // C. Ganesh Puja
  const ritualGanesh = await prisma.ritual.create({
    data: {
      categoryId: catFestive.id,
      name: 'Ganesh Puja & Homa',
      slug: 'ganesh-puja',
      description: 'Invokes Lord Ganesha, the remover of all hurdles (Vighnaharta). Ideal before launching new ventures, opening offices, or starting new academic terms.',
      shortDescription: 'Remove obstacles and invite good fortune with Ganapati Puja & Homa',
      durationHours: 2.0,
      languages: 'Telugu, Hindi, Sanskrit',
      traditions: 'Vedic, Smartha',
      samagriChecklist: JSON.stringify([
        'Modak / Ladoo prasad, Durva grass',
        'Red hibiscus flowers, Garlands',
        'Coconuts, Jaggery, Cow ghee, Havan samagri'
      ]),
      priestCountRequired: 1,
      basePrice: 2800,
      isPublished: true,
      packages: {
        create: [
          {
            name: 'Standard Ganapati Puja & Havan',
            tier: 'STANDARD',
            description: 'Vedic Ganapati Atharvashirsha parayanam, 108 Modaka / Durva archana and sacred Ganapati Homa with complete samagri.',
            inclusions: JSON.stringify([
              'Pandit-supplied samagri and dry coconut homa sticks',
              'Ganapati Atharvashirsha Parayanam',
              '108 Name Ashtottara Archana',
              'Ganapati Havan for obstacle removal'
            ]),
            exclusions: JSON.stringify([]),
            panditFee: 3000,
            samagriCost: 1100,
            travelCost: 300,
            platformFee: 300,
            taxes: 54,
            totalAmount: 4754,
            samagriOption: 'FULL_SAMAGRI_INCLUDED',
          },
        ],
      },
    },
    include: { packages: true },
  });

  // D. Maha Rudrabhishek
  const ritualRudra = await prisma.ritual.create({
    data: {
      categoryId: catHavan.id,
      name: 'Maha Rudrabhishek',
      slug: 'rudrabhishek',
      description: 'Powerful Vedic bathing ritual of Shiva Linga accompanied by continuous chanting of Sri Rudram and Chamakam from the Krishna Yajurveda. Bestows health, peace, and spiritual fortitude.',
      shortDescription: 'Holy bathing of Shiva Linga with Sri Rudram chanting & Panchamrit',
      durationHours: 2.5,
      languages: 'Telugu, Sanskrit, Hindi',
      traditions: 'Vedic, Smartha',
      samagriChecklist: JSON.stringify([
        'Bel Patra (Bilva leaves - 21 pcs)',
        'Cow Milk, Curd, Honey, Ghee, Sugar, Gangajal',
        'Vibhuti (Bhasma), Sandalwood paste, White flowers'
      ]),
      priestCountRequired: 1,
      basePrice: 3500,
      isPublished: true,
      packages: {
        create: [
          {
            name: 'Standard Ekadasa Rudrabhishek',
            tier: 'STANDARD',
            description: 'Complete Sri Rudram recitation, 11 types of sacred abhishek liquids, Bilva archana, and Shiva Aarti.',
            inclusions: JSON.stringify([
              'Abhishek dravyas: Honey, Gangajal, Sandalwood paste, Vibhuti',
              'Continuous recitation of Namakam & Chamakam',
              'Bilva Patra Ashtottara Archana',
              'Maha Mrityunjaya mantra japa'
            ]),
            exclusions: JSON.stringify([
              'Fresh cow milk and curd (prepared by customer)'
            ]),
            panditFee: 3800,
            samagriCost: 1000,
            travelCost: 300,
            platformFee: 380,
            taxes: 68,
            totalAmount: 5548,
            samagriOption: 'FULL_SAMAGRI_INCLUDED',
          },
        ],
      },
    },
    include: { packages: true },
  });

  // 6. Create Seed Bookings
  // Booking 1: Completed Booking with Review
  const standardGrihaPkg = ritualGriha.packages.find(p => p.tier === 'STANDARD');
  const pastDate = '2026-09-15';

  const completedBooking = await prisma.booking.create({
    data: {
      bookingNumber: 'PC-HYD-202609-1082',
      customerId: customerUser.id,
      panditId: pandit1User.panditProfile.id,
      ritualId: ritualGriha.id,
      packageId: standardGrihaPkg.id,
      status: 'COMPLETED',
      bookingMode: 'INSTANT',
      scheduledDate: pastDate,
      startTime: '08:00',
      endTime: '11:30',
      ceremonyAddress: 'Flat 402, Aditya Sunshine Apartments, Madhapur, Hyderabad',
      city: 'Hyderabad',
      locality: 'Madhapur',
      pincode: '500081',
      language: 'Telugu',
      samagriOption: 'FULL_SAMAGRI_INCLUDED',
      specialInstructions: 'Please ensure Navagraha Havan firewood does not trigger fire alarm in our high-rise apartment.',
      priceSnapshot: JSON.stringify({
        panditFee: standardGrihaPkg.panditFee,
        samagriCost: standardGrihaPkg.samagriCost,
        travelCost: standardGrihaPkg.travelCost,
        platformFee: standardGrihaPkg.platformFee,
        taxes: standardGrihaPkg.taxes,
        totalAmount: standardGrihaPkg.totalAmount,
      }),
      totalAmount: standardGrihaPkg.totalAmount,
      panditPayoutAmount: standardGrihaPkg.panditFee * 0.85 + standardGrihaPkg.samagriCost + standardGrihaPkg.travelCost,
      platformCommissionAmount: standardGrihaPkg.totalAmount - (standardGrihaPkg.panditFee * 0.85 + standardGrihaPkg.samagriCost + standardGrihaPkg.travelCost),
      cancellationPolicySnapshot: 'Standard PujaConnect Cancellation & Refund Policy',
      completedAt: new Date('2026-09-15T12:00:00Z'),
      statusHistory: {
        create: [
          { fromStatus: 'DRAFT', toStatus: 'CONFIRMED', reason: 'Booking confirmed with online payment' },
          { fromStatus: 'CONFIRMED', toStatus: 'IN_PROGRESS', reason: 'Pandit arrived at ceremony location' },
          { fromStatus: 'IN_PROGRESS', toStatus: 'COMPLETED', reason: 'Ceremony successfully completed with blessings' },
        ],
      },
      payments: {
        create: {
          transactionNumber: 'TXN-20260910-4491',
          amount: standardGrihaPkg.totalAmount,
          currency: 'INR',
          provider: 'SANDBOX_SIMULATOR',
          providerPaymentId: 'pay_sim_948194',
          status: 'SUCCESS',
          signatureVerified: true,
        },
      },
      earnings: {
        create: {
          panditId: pandit1User.panditProfile.id,
          grossAmount: standardGrihaPkg.totalAmount,
          commissionDeducted: 975,
          netPayable: 8792,
          payoutStatus: 'PAID',
          payoutDate: new Date('2026-09-18T10:00:00Z'),
          payoutReference: 'IMPS-HYD-8472910',
        },
      },
      review: {
        create: {
          customerId: customerUser.id,
          panditId: pandit1User.panditProfile.id,
          rating: 5,
          ritualQualityRating: 5,
          punctualityRating: 5,
          comment: 'Pt. Rama Shastri was exceptionally punctual, respectful, and explained the deep Vedic significance of every Griha Pravesh mantra in pure Telugu. He handled the high-rise smoke-free havan perfectly. Highly recommended!',
          isVerifiedCompletedBooking: true,
        },
      },
    },
  });

  // Booking 2: Upcoming Confirmed Booking
  const standardSatyaPkg = ritualSatyanarayan.packages.find(p => p.tier === 'STANDARD');
  const futureDate = '2026-10-25';

  const upcomingBooking = await prisma.booking.create({
    data: {
      bookingNumber: 'PC-HYD-202610-3841',
      customerId: customerUser.id,
      panditId: pandit2User.panditProfile.id,
      ritualId: ritualSatyanarayan.id,
      packageId: standardSatyaPkg.id,
      status: 'CONFIRMED',
      bookingMode: 'INSTANT',
      scheduledDate: futureDate,
      startTime: '10:00',
      endTime: '12:30',
      ceremonyAddress: 'Villa 14, Rainbow Meadows, Kondapur, Hyderabad',
      city: 'Hyderabad',
      locality: 'Kondapur',
      pincode: '500084',
      language: 'Telugu',
      samagriOption: 'FULL_SAMAGRI_INCLUDED',
      specialInstructions: 'Purnima day ceremony. Please arrive 15 minutes before 10 AM.',
      priceSnapshot: JSON.stringify({
        panditFee: standardSatyaPkg.panditFee,
        samagriCost: standardSatyaPkg.samagriCost,
        travelCost: standardSatyaPkg.travelCost,
        platformFee: standardSatyaPkg.platformFee,
        taxes: standardSatyaPkg.taxes,
        totalAmount: standardSatyaPkg.totalAmount,
      }),
      totalAmount: standardSatyaPkg.totalAmount,
      panditPayoutAmount: Math.round(standardSatyaPkg.panditFee * 0.85 + standardSatyaPkg.samagriCost + standardSatyaPkg.travelCost),
      platformCommissionAmount: Math.round(standardSatyaPkg.totalAmount - (standardSatyaPkg.panditFee * 0.85 + standardSatyaPkg.samagriCost + standardSatyaPkg.travelCost)),
      cancellationPolicySnapshot: 'Standard PujaConnect Cancellation & Refund Policy',
      statusHistory: {
        create: [
          { fromStatus: 'DRAFT', toStatus: 'CONFIRMED', reason: 'Booking confirmed via online payment' },
        ],
      },
      payments: {
        create: {
          transactionNumber: 'TXN-20261008-8821',
          amount: standardSatyaPkg.totalAmount,
          currency: 'INR',
          provider: 'SANDBOX_SIMULATOR',
          providerPaymentId: 'pay_sim_102938',
          status: 'SUCCESS',
          signatureVerified: true,
        },
      },
      earnings: {
        create: {
          panditId: pandit2User.panditProfile.id,
          grossAmount: standardSatyaPkg.totalAmount,
          commissionDeducted: 480,
          netPayable: 4598,
          payoutStatus: 'PENDING',
        },
      },
    },
  });

  console.log('✅ Database seeded successfully with:');
  console.log(`- 1 Admin: admin@pujaconnect.com / Admin@1234`);
  console.log(`- 1 Customer: customer@pujaconnect.com / Password@123`);
  console.log(`- 3 Pandits (2 Approved, 1 Pending): pandit.shastri@pujaconnect.com / Password@123`);
  console.log(`- 4 Ritual Categories & 4 Core Rituals with detailed Packages`);
  console.log(`- 2 Realistic Bookings (1 Completed with review, 1 Confirmed upcoming)`);
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
