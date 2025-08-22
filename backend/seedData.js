const mongoose = require('mongoose');
const Base = require('./models/Base');
const User = require('./models/User');
require('dotenv').config();

const seedData = async () => {
  try {
    // Connect to MongoDB
  await mongoose.connect('mongodb+srv://mvarunmathi2004:4546@cluster0.cwbdpuu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

    console.log('🔗 Connected to MongoDB for seeding...');

    // Clear existing data
    await Base.deleteMany({});
    await User.deleteMany({});
    console.log('🗑️ Cleared existing data');

    // Seed bases
    const bases = [
      {
        name: 'Fort Knox',
        location: 'Kentucky, USA',
        state: 'KY',
        commander: 'Colonel James Wilson',
        capacity: 2500,
        established: new Date('1918-01-01')
      },
      {
        name: 'Fort Bragg',
        location: 'North Carolina, USA',
        state: 'NC',
        commander: 'General Sarah Martinez',
        capacity: 5000,
        established: new Date('1918-09-04')
      },
      {
        name: 'Camp Pendleton',
        location: 'California, USA',
        state: 'CA',
        commander: 'Colonel Michael Chen',
        capacity: 3800,
        established: new Date('1942-09-25')
      },
      {
        name: 'Naval Station Norfolk',
        location: 'Virginia, USA',
        state: 'VA',
        commander: 'Admiral Lisa Thompson',
        capacity: 4200,
        established: new Date('1917-02-07')
      },
      {
        name: 'Wright-Patterson AFB',
        location: 'Ohio, USA',
        state: 'OH',
        commander: 'General Robert Davis',
        capacity: 3200,
        established: new Date('1917-05-22')
      }
    ];

    const createdBases = await Base.insertMany(bases);
    console.log(`✅ Created ${createdBases.length} military bases`);

    // Seed admin user
    const adminUser = new User({
      username: 'admin',
      email: 'admin@military.gov',
      password: 'admin123', // This will be hashed automatically
      role: 'admin',
      base_id: createdBases[0]._id,
      base_name: createdBases[0].name,
      base_location: createdBases[0].location
    });

    await adminUser.save();
    console.log('✅ Created admin user: admin / admin123');

    // Seed demo users
    const demoUsers = [
      {
        username: 'commander',
        email: 'commander@military.gov',
        password: 'commander123',
        role: 'commander',
        base_id: createdBases[1]._id,
        base_name: createdBases[1].name,
        base_location: createdBases[1].location
      },
      {
        username: 'logistics',
        email: 'logistics@military.gov',
        password: 'logistics123',
        role: 'logistics_officer',
        base_id: createdBases[2]._id,
        base_name: createdBases[2].name,
        base_location: createdBases[2].location
      },
      {
        username: 'demo',
        email: 'demo@military.gov',
        password: 'demo123',
        role: 'inventory_manager',
        base_id: createdBases[3]._id,
        base_name: createdBases[3].name,
        base_location: createdBases[3].location
      }
    ];

    for (const userData of demoUsers) {
      const user = new User(userData);
      await user.save();
    }

    console.log('✅ Created demo users:');
    console.log('   - commander / commander123');
    console.log('   - logistics / logistics123');
    console.log('   - demo / demo123');

    console.log('🎉 Database seeding completed successfully!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
