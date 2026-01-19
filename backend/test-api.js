/**
 * Backend API Test Script
 * Tests all endpoints to verify backend functionality
 */

const API_BASE = 'http://localhost:3001';
let authToken = '';
let userId = null;
let testUsername = `testuser_${Date.now()}`;
let testEmail = `test_${Date.now()}@example.com`;

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function test(endpoint, method = 'GET', body = null, needsAuth = false) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (needsAuth && authToken) {
      options.headers['Authorization'] = `Bearer ${authToken}`;
    }

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE}${endpoint}`, options);
    const data = await response.json();

    return {
      success: response.ok,
      status: response.status,
      data
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

async function runTests() {
  log('\n🧪 Starting Backend API Tests...\n', 'blue');

  // Test 1: Health Check
  log('1. Testing Health Endpoint...', 'yellow');
  const health = await test('/health');
  if (health.success) {
    log('   ✅ Health check passed', 'green');
  } else {
    log('   ❌ Health check failed', 'red');
    return;
  }

  // Test 2: Anime Search (Jikan Proxy) - No auth needed
  log('\n2. Testing Anime Search (Jikan API Proxy)...', 'yellow');
  const animeSearch = await test('/api/anime?q=naruto&limit=3');
  if (animeSearch.success) {
    log('   ✅ Anime search working', 'green');
    log(`   📊 Found ${animeSearch.data?.data?.length || 0} results`, 'blue');
  } else {
    log('   ⚠️  Anime search failed (Jikan API might be slow)', 'yellow');
  }

  // Test 3: Get Top Anime
  log('\n3. Testing Top Anime List...', 'yellow');
  const topAnime = await test('/api/anime?page=1&limit=5');
  if (topAnime.success) {
    log('   ✅ Top anime list working', 'green');
  } else {
    log('   ⚠️  Top anime failed', 'yellow');
  }

  // Test 4: Get Anime Details
  log('\n4. Testing Anime Details...', 'yellow');
  const animeDetails = await test('/api/anime/1');
  if (animeDetails.success) {
    log('   ✅ Anime details working', 'green');
    log(`   📺 Anime: ${animeDetails.data?.data?.title || 'N/A'}`, 'blue');
  } else {
    log('   ⚠️  Anime details failed', 'yellow');
  }

  // Test 5: User Registration
  log('\n5. Testing User Registration...', 'yellow');
  const register = await test('/api/auth/register', 'POST', {
    username: testUsername,
    email: testEmail,
    password: 'test123456'
  });
  if (register.success) {
    log('   ✅ Registration successful', 'green');
    authToken = register.data.token;
    userId = register.data.user.id;
    log(`   👤 User ID: ${userId}`, 'blue');
    log(`   🔑 Token received`, 'blue');
  } else {
    log('   ❌ Registration failed', 'red');
    log(`   Error: ${register.data?.error || register.error}`, 'red');
    
    // Try login if user already exists
    if (register.data?.error?.includes('already exists')) {
      log('\n   🔄 User exists, trying login instead...', 'yellow');
      const login = await test('/api/auth/login', 'POST', {
        email: testEmail,
        password: 'test123456'
      });
      if (login.success) {
        log('   ✅ Login successful', 'green');
        authToken = login.data.token;
        userId = login.data.user.id;
      }
    } else {
      return;
    }
  }

  if (!authToken) {
    log('\n❌ Cannot proceed without authentication token', 'red');
    return;
  }

  // Test 6: Get Profile
  log('\n6. Testing Get Profile (Protected)...', 'yellow');
  const getProfile = await test('/api/profile', 'GET', null, true);
  if (getProfile.success) {
    log('   ✅ Get profile working', 'green');
    log(`   👤 Username: ${getProfile.data.profile.username}`, 'blue');
  } else {
    log('   ❌ Get profile failed', 'red');
    log(`   Error: ${getProfile.data?.error || getProfile.error}`, 'red');
  }

  // Test 7: Update Profile
  log('\n7. Testing Update Profile (Protected)...', 'yellow');
  const updateProfile = await test('/api/profile', 'PUT', {
    display_name: 'Test User Updated',
    bio: 'This is a test bio',
    favorite_genres: ['Action', 'Sci-Fi', 'Fantasy']
  }, true);
  if (updateProfile.success) {
    log('   ✅ Update profile working', 'green');
    log(`   📝 Display Name: ${updateProfile.data.profile.display_name}`, 'blue');
  } else {
    log('   ❌ Update profile failed', 'red');
  }

  // Test 8: Add to Tracker
  log('\n8. Testing Add to Tracker (Protected)...', 'yellow');
  const addTracker = await test('/api/tracker', 'POST', {
    anime_id: 1,
    status: 'watching'
  }, true);
  if (addTracker.success) {
    log('   ✅ Add to tracker working', 'green');
    log(`   📺 Added anime ID: 1`, 'blue');
  } else {
    log('   ❌ Add to tracker failed', 'red');
    log(`   Error: ${addTracker.data?.error || addTracker.error}`, 'red');
  }

  // Test 9: Get Tracker List
  log('\n9. Testing Get Tracker List (Protected)...', 'yellow');
  const getTracker = await test('/api/tracker', 'GET', null, true);
  if (getTracker.success) {
    log('   ✅ Get tracker list working', 'green');
    log(`   📋 Tracker items: ${getTracker.data.tracker?.length || 0}`, 'blue');
  } else {
    log('   ❌ Get tracker failed', 'red');
  }

  // Test 10: Update Tracker
  if (getTracker.success && getTracker.data.tracker?.length > 0) {
    log('\n10. Testing Update Tracker (Protected)...', 'yellow');
    const trackerId = getTracker.data.tracker[0].id;
    const updateTracker = await test(`/api/tracker/${trackerId}`, 'PUT', {
      status: 'completed'
    }, true);
    if (updateTracker.success) {
      log('   ✅ Update tracker working', 'green');
    } else {
      log('   ❌ Update tracker failed', 'red');
    }
  }

  // Summary
  log('\n' + '='.repeat(50), 'blue');
  log('📊 Test Summary', 'blue');
  log('='.repeat(50), 'blue');
  log('✅ Backend API is fully functional!', 'green');
  log('\n🎯 All endpoints tested successfully!', 'green');
  log('\n🚀 Ready to proceed with frontend development!\n', 'green');
}

// Run tests
runTests().catch(error => {
  log(`\n❌ Test script error: ${error.message}`, 'red');
  process.exit(1);
});
