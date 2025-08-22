// Temporary in-memory storage for development/testing without PostgreSQL
const bcrypt = require('bcrypt');

// In-memory storage
let users = [];
let nextUserId = 1;

// Pre-populate with demo users
const initializeUsers = async () => {
  if (users.length === 0) {
    const demoUsers = [
      {
        id: 1,
        username: 'Administrator',
        email: 'admin@military.gov',
        password: await bcrypt.hash('admin123', 10),
        role: 'admin',
        base_id: 1,
        base_name: 'Fort Alpha',
        base_location: 'Washington, DC',
        created_at: new Date()
      },
      {
        id: 2,
        username: 'Alpha Commander',
        email: 'commander.alpha@military.gov',
        password: await bcrypt.hash('commander123', 10),
        role: 'base_commander',
        base_id: 1,
        base_name: 'Fort Alpha',
        base_location: 'Washington, DC',
        created_at: new Date()
      },
      {
        id: 3,
        username: 'Alpha Logistics',
        email: 'logistics.alpha@military.gov',
        password: await bcrypt.hash('logistics123', 10),
        role: 'logistics_officer',
        base_id: 1,
        base_name: 'Fort Alpha',
        base_location: 'Washington, DC',
        created_at: new Date()
      },
      {
        id: 4,
        username: 'Beta Commander',
        email: 'commander.beta@military.gov',
        password: await bcrypt.hash('beta123', 10),
        role: 'base_commander',
        base_id: 2,
        base_name: 'Base Beta',
        base_location: 'San Diego, CA',
        created_at: new Date()
      },
      {
        id: 5,
        username: 'Beta Logistics',
        email: 'logistics.beta@military.gov',
        password: await bcrypt.hash('beta456', 10),
        role: 'logistics_officer',
        base_id: 2,
        base_name: 'Base Beta',
        base_location: 'San Diego, CA',
        created_at: new Date()
      },
      {
        id: 6,
        username: 'Gamma Commander',
        email: 'commander.gamma@military.gov',
        password: await bcrypt.hash('gamma123', 10),
        role: 'base_commander',
        base_id: 3,
        base_name: 'Station Gamma',
        base_location: 'Norfolk, VA',
        created_at: new Date()
      },
      {
        id: 7,
        username: 'Delta Training Officer',
        email: 'training.delta@military.gov',
        password: await bcrypt.hash('delta123', 10),
        role: 'logistics_officer',
        base_id: 4,
        base_name: 'Camp Delta',
        base_location: 'Fort Bragg, NC',
        created_at: new Date()
      },
      {
        id: 8,
        username: 'Echo Naval Operations',
        email: 'naval.echo@military.gov',
        password: await bcrypt.hash('echo123', 10),
        role: 'base_commander',
        base_id: 5,
        base_name: 'Naval Base Echo',
        base_location: 'Pearl Harbor, HI',
        created_at: new Date()
      },
      {
        id: 9,
        username: 'Foxtrot Air Operations',
        email: 'air.foxtrot@military.gov',
        password: await bcrypt.hash('foxtrot123', 10),
        role: 'logistics_officer',
        base_id: 6,
        base_name: 'Air Force Base Foxtrot',
        base_location: 'Colorado Springs, CO',
        created_at: new Date()
      },
      {
        id: 10,
        username: 'Golf Marine Commander',
        email: 'marine.golf@military.gov',
        password: await bcrypt.hash('golf123', 10),
        role: 'base_commander',
        base_id: 7,
        base_name: 'Marine Base Golf',
        base_location: 'Camp Pendleton, CA',
        created_at: new Date()
      }
    ];
    
    users = demoUsers;
    nextUserId = 11;
  }
};

class MemoryUser {
  static async create(userData) {
    await initializeUsers();
    
    const { username, email, password, role, base_id } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Simulate base lookup
    const bases = {
      1: { name: 'Fort Alpha', location: 'Washington, DC' },
      2: { name: 'Base Beta', location: 'San Diego, CA' },
      3: { name: 'Station Gamma', location: 'Norfolk, VA' },
      4: { name: 'Camp Delta', location: 'Fort Bragg, NC' },
      5: { name: 'Naval Base Echo', location: 'Pearl Harbor, HI' },
      6: { name: 'Air Force Base Foxtrot', location: 'Colorado Springs, CO' },
      7: { name: 'Marine Base Golf', location: 'Camp Pendleton, CA' },
      8: { name: 'Joint Base Hotel', location: 'Anchorage, AK' },
      9: { name: 'Training Center India', location: 'Fort Leonard Wood, MO' },
      10: { name: 'Command Base Juliet', location: 'Tampa, FL' }
    };
    
    const base = bases[base_id] || { name: 'Unknown Base', location: 'Unknown' };
    
    const user = {
      id: nextUserId++,
      username,
      email,
      password: hashedPassword,
      role,
      base_id: parseInt(base_id),
      base_name: base.name,
      base_location: base.location,
      created_at: new Date()
    };
    
    users.push(user);
    return user;
  }

  static async findByEmail(email) {
    await initializeUsers();
    return users.find(user => user.email === email);
  }

  static async findById(id) {
    await initializeUsers();
    return users.find(user => user.id === parseInt(id));
  }

  static async validatePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = MemoryUser;
