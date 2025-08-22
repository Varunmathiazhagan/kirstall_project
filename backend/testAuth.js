const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api/auth';

const testAuthentication = async () => {
  console.log('🧪 Testing Military Asset Management Authentication API');
  console.log('='.repeat(60));

  try {
    // Test 1: Get bases
    console.log('\n1️⃣ Testing GET /bases...');
    const basesResponse = await axios.get(`${BASE_URL}/bases`);
    console.log('✅ Bases retrieved successfully:');
    basesResponse.data.bases.forEach(base => {
      console.log(`   - ${base.name} (${base.location})`);
    });

    // Test 2: User signup
    console.log('\n2️⃣ Testing POST /signup...');
    const signupData = {
      username: 'testuser',
      email: 'testuser@military.gov',
      password: 'test123',
      confirmPassword: 'test123',
      role: 'logistics_officer',
      base_id: basesResponse.data.bases[0].id
    };

    try {
      const signupResponse = await axios.post(`${BASE_URL}/signup`, signupData);
      console.log('✅ Signup successful:');
      console.log(`   User: ${signupResponse.data.user.username}`);
      console.log(`   Email: ${signupResponse.data.user.email}`);
      console.log(`   Role: ${signupResponse.data.user.role}`);
    } catch (signupError) {
      if (signupError.response?.status === 400 && signupError.response.data.message?.includes('already exists')) {
        console.log('⚠️  User already exists (expected for repeated tests)');
      } else {
        throw signupError;
      }
    }

    // Test 3: User login with admin account
    console.log('\n3️⃣ Testing POST /login with admin account...');
    const loginData = {
      username: 'admin',
      password: 'admin123'
    };

    const loginResponse = await axios.post(`${BASE_URL}/login`, loginData);
    console.log('✅ Login successful:');
    console.log(`   User: ${loginResponse.data.user.username}`);
    console.log(`   Role: ${loginResponse.data.user.role}`);
    console.log(`   Base: ${loginResponse.data.user.base_name}`);
    console.log(`   Token: ${loginResponse.data.token.substring(0, 20)}...`);

    const token = loginResponse.data.token;

    // Test 4: Get user profile
    console.log('\n4️⃣ Testing GET /profile...');
    const profileResponse = await axios.get(`${BASE_URL}/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('✅ Profile retrieved successfully:');
    console.log(`   ID: ${profileResponse.data.user.id}`);
    console.log(`   Username: ${profileResponse.data.user.username}`);
    console.log(`   Email: ${profileResponse.data.user.email}`);
    console.log(`   Last Login: ${profileResponse.data.user.lastLogin || 'First login'}`);

    // Test 5: Test invalid login
    console.log('\n5️⃣ Testing invalid login...');
    try {
      await axios.post(`${BASE_URL}/login`, {
        username: 'invalid',
        password: 'wrong'
      });
      console.log('❌ Invalid login should have failed');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Invalid login correctly rejected');
      } else {
        throw error;
      }
    }

    // Test 6: Test protected route without token
    console.log('\n6️⃣ Testing protected route without token...');
    try {
      await axios.get(`${BASE_URL}/profile`);
      console.log('❌ Protected route should require authentication');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Protected route correctly requires authentication');
      } else {
        throw error;
      }
    }

    // Test 7: Logout
    console.log('\n7️⃣ Testing POST /logout...');
    const logoutResponse = await axios.post(`${BASE_URL}/logout`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('✅ Logout successful:', logoutResponse.data.message);

    console.log('\n🎉 All authentication tests passed successfully!');
    console.log('\n📋 Demo Accounts Available:');
    console.log('   👑 admin / admin123 (Administrator)');
    console.log('   🎖️  commander / commander123 (Commander)');
    console.log('   📦 logistics / logistics123 (Logistics Officer)');
    console.log('   📊 demo / demo123 (Inventory Manager)');

  } catch (error) {
    console.error('\n❌ Test failed:', error.response?.data || error.message);
    console.error('Make sure the backend server is running on port 5000');
  }
};

// Install axios if not present
const installDependencies = async () => {
  try {
    require('axios');
  } catch (error) {
    console.log('Installing axios for testing...');
    const { execSync } = require('child_process');
    execSync('npm install axios', { stdio: 'inherit' });
  }
};

const main = async () => {
  await installDependencies();
  await testAuthentication();
};

main();
