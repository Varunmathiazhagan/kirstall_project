const axios = require('axios');

const API_BASE = 'http://localhost:5000/api/auth';

async function testAuthentication() {
  console.log('🔐 Testing Authentication System...\n');

  // Test 1: Login with existing account
  try {
    console.log('Test 1: Login with existing account');
    const loginResponse = await axios.post(`${API_BASE}/login`, {
      username: 'admin',
      password: 'admin123'
    });
    
    console.log('✅ Login successful:', loginResponse.data.message);
    console.log('   Token received:', loginResponse.data.token ? 'Yes' : 'No');
    console.log('   User role:', loginResponse.data.user?.role);
  } catch (error) {
    console.log('❌ Login failed:');
    console.log('   Status:', error.response?.status);
    console.log('   Message:', error.response?.data?.message || error.message);
    console.log('   Error:', error.response?.data?.error);
  }

  console.log('\n---\n');

  // Test 2: Signup with new account
  try {
    console.log('Test 2: Signup with new account');
    const signupData = {
      username: 'testuser123',
      email: 'testuser123@military.com',
      password: 'password123',
      confirmPassword: 'password123',
      role: 'logistics_officer',
      base_id: '1'
    };

    const signupResponse = await axios.post(`${API_BASE}/signup`, signupData);
    
    console.log('✅ Signup successful:', signupResponse.data.message);
    console.log('   User created:', signupResponse.data.user?.username);
  } catch (error) {
    console.log('❌ Signup failed:');
    console.log('   Status:', error.response?.status);
    console.log('   Message:', error.response?.data?.message || error.message);
    console.log('   Error:', error.response?.data?.error);
  }

  console.log('\n---\n');

  // Test 3: Login with newly created account
  try {
    console.log('Test 3: Login with newly created account');
    const newLoginResponse = await axios.post(`${API_BASE}/login`, {
      username: 'testuser123',
      password: 'password123'
    });
    
    console.log('✅ New account login successful:', newLoginResponse.data.message);
    console.log('   Token received:', newLoginResponse.data.token ? 'Yes' : 'No');
  } catch (error) {
    console.log('❌ New account login failed:');
    console.log('   Status:', error.response?.status);
    console.log('   Message:', error.response?.data?.message || error.message);
    console.log('   Error:', error.response?.data?.error);
  }

  console.log('\n---\n');

  // Test 4: Login with email instead of username
  try {
    console.log('Test 4: Login with email instead of username');
    const emailLoginResponse = await axios.post(`${API_BASE}/login`, {
      email: 'testuser123@military.com',
      password: 'password123'
    });
    
    console.log('✅ Email login successful:', emailLoginResponse.data.message);
  } catch (error) {
    console.log('❌ Email login failed:');
    console.log('   Status:', error.response?.status);
    console.log('   Message:', error.response?.data?.message || error.message);
    console.log('   Error:', error.response?.data?.error);
  }

  console.log('\n🔐 Authentication testing complete!\n');
}

// Run the test
testAuthentication().catch(console.error);
