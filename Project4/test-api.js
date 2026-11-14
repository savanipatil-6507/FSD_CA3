/**
 * Integration Test Suite for Project 4 Express REST API
 */
const http = require('http');
const app = require('./server');

const TEST_PORT = 5050;

function sendReq({ path, method, headers = {}, body }) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: TEST_PORT,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', reject);
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  const server = app.listen(TEST_PORT, async () => {
    console.log(`Express test server running on port ${TEST_PORT}\n`);

    try {
      // 1. GET Root
      console.log('1. Testing GET / (Root info)');
      const rootRes = await sendReq({ path: '/', method: 'GET' });
      console.log(`   Status: ${rootRes.status} - Service: ${rootRes.body.service}`);

      // 2. Auth: Register
      console.log('2. Testing POST /api/auth/register (bcrypt hashing)');
      const regRes = await sendReq({
        path: '/api/auth/register',
        method: 'POST',
        body: { username: 'nurse_sarah', password: 'password123', role: 'head_nurse' }
      });
      console.log(`   Status: ${regRes.status} - User: ${regRes.body.data.username}`);

      // 3. Auth: Login
      console.log('3. Testing POST /api/auth/login (JWT issuance)');
      const loginRes = await sendReq({
        path: '/api/auth/login',
        method: 'POST',
        body: { username: 'nurse_sarah', password: 'password123' }
      });
      const jwtToken = loginRes.body.token;
      console.log(`   Status: ${loginRes.status} - Token received: ${jwtToken ? 'YES (JWT valid)' : 'NO'}`);

      // 4. CRUD: GET /api/appointments
      console.log('4. Testing GET /api/appointments');
      const getRes = await sendReq({ path: '/api/appointments', method: 'GET' });
      console.log(`   Status: ${getRes.status} - Total count: ${getRes.body.count}`);

      // 5. Middleware: Input validation on POST
      console.log('5. Testing Input Validation Middleware (Invalid POST)');
      const invalidPost = await sendReq({
        path: '/api/appointments',
        method: 'POST',
        body: { patientName: 'A' } // Missing mandatory fields
      });
      console.log(`   Status: ${invalidPost.status} - Errors caught: ${invalidPost.body.details.length}`);

      // 6. CRUD: POST /api/appointments (Valid creation)
      console.log('6. Testing POST /api/appointments (Valid payload)');
      const createRes = await sendReq({
        path: '/api/appointments',
        method: 'POST',
        body: {
          patientName: 'Gregory House',
          patientPhone: '9876543210',
          department: 'Diagnostics',
          doctorName: 'Dr. James Wilson',
          appointmentDate: '2026-11-30',
          appointmentTime: '11:00',
          reason: 'Severe leg pain consultation'
        }
      });
      const createdId = createRes.body.data.id;
      console.log(`   Status: ${createRes.status} - Created ID: ${createdId}`);

      // 7. CRUD: PUT /api/appointments/:id
      console.log(`7. Testing PUT /api/appointments/${createdId}`);
      const putRes = await sendReq({
        path: `/api/appointments/${createdId}`,
        method: 'PUT',
        body: { status: 'Completed' }
      });
      console.log(`   Status: ${putRes.status} - Status updated to: ${putRes.body.data.status}`);

      // 8. Protected Route WITHOUT JWT (Should be 401)
      console.log('8. Testing Protected Route GET /api/appointments/admin/stats WITHOUT token');
      const unauthStats = await sendReq({
        path: '/api/appointments/admin/stats',
        method: 'GET'
      });
      console.log(`   Status: ${unauthStats.status} - Message: ${unauthStats.body.message}`);

      // 9. Protected Route WITH valid JWT (Should be 200)
      console.log('9. Testing Protected Route GET /api/appointments/admin/stats WITH valid JWT');
      const authStats = await sendReq({
        path: '/api/appointments/admin/stats',
        method: 'GET',
        headers: { 'Authorization': `Bearer ${jwtToken}` }
      });
      console.log(`   Status: ${authStats.status} - Total Appts: ${authStats.body.analytics.totalAppointments}`);

      // 10. Protected DELETE Route WITH JWT
      console.log(`10. Testing Protected DELETE /api/appointments/${createdId} WITH valid JWT`);
      const deleteRes = await sendReq({
        path: `/api/appointments/${createdId}`,
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${jwtToken}` }
      });
      console.log(`   Status: ${deleteRes.status} - Message: ${deleteRes.body.message}`);

      // 11. Centralized 404 Route
      console.log('11. Testing Centralized 404 handler');
      const notFoundRes = await sendReq({ path: '/api/nonexistent', method: 'GET' });
      console.log(`   Status: ${notFoundRes.status} - Error: ${notFoundRes.body.error}`);

      console.log('\nAll Express REST API tests completed successfully!');
    } catch (err) {
      console.error('Test failed with error:', err);
    } finally {
      server.close();
      process.exit(0);
    }
  });
}

runTests();

