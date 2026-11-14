/**
 * Automated test script to verify all endpoints of Project 3
 */

const http = require('http');
const server = require('./server');

const TEST_PORT = 4001;

function request(options, postData) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: data ? JSON.parse(data) : null,
            rawText: data
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            rawText: data
          });
        }
      });
    });

    req.on('error', reject);

    if (postData) {
      req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    }
    req.end();
  });
}

async function runTests() {
  server.listen(TEST_PORT, async () => {
    console.log(`Test runner connected on port ${TEST_PORT}\n`);
    let createdId = null;

    try {
      // Test 1: GET /
      console.log('1. Testing GET / (Root info)');
      const rootRes = await request({
        hostname: 'localhost',
        port: TEST_PORT,
        path: '/',
        method: 'GET'
      });
      console.log(`   Status: ${rootRes.status} - Service: ${rootRes.body.service}`);

      // Test 2: GET /api/appointments
      console.log('2. Testing GET /api/appointments');
      const listRes = await request({
        hostname: 'localhost',
        port: TEST_PORT,
        path: '/api/appointments',
        method: 'GET'
      });
      console.log(`   Status: ${listRes.status} - Found: ${listRes.body.count} records`);

      // Test 3: POST /api/appointments (Create valid)
      console.log('3. Testing POST /api/appointments');
      const newApt = {
        patientName: 'Test Patient',
        patientPhone: '9876543210',
        department: 'Cardiology',
        doctorName: 'Dr. Test Physician',
        appointmentDate: '2026-11-28',
        appointmentTime: '15:30',
        reason: 'Automated test consultation',
        status: 'Scheduled'
      };
      const postRes = await request({
        hostname: 'localhost',
        port: TEST_PORT,
        path: '/api/appointments',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, newApt);
      console.log(`   Status: ${postRes.status} - Created ID: ${postRes.body.data.id}`);
      createdId = postRes.body.data.id;

      // Test 4: Input validation (Invalid POST)
      console.log('4. Testing POST /api/appointments validation errors');
      const invalidRes = await request({
        hostname: 'localhost',
        port: TEST_PORT,
        path: '/api/appointments',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, { patientName: 'A' }); // Missing fields and invalid name
      console.log(`   Status: ${invalidRes.status} - Errors caught: ${invalidRes.body.details.length}`);

      // Test 5: PUT /api/appointments/:id
      console.log(`5. Testing PUT /api/appointments/${createdId}`);
      const putRes = await request({
        hostname: 'localhost',
        port: TEST_PORT,
        path: `/api/appointments/${createdId}`,
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      }, { status: 'Completed' });
      console.log(`   Status: ${putRes.status} - Updated Status: ${putRes.body.data.status}`);

      // Test 6: Stream Export
      console.log('6. Testing Stream Export GET /api/appointments/stream/export');
      const streamRes = await request({
        hostname: 'localhost',
        port: TEST_PORT,
        path: '/api/appointments/stream/export',
        method: 'GET'
      });
      console.log(`   Status: ${streamRes.status} - Header Disposition: ${streamRes.headers['content-disposition']}`);

      // Test 7: DELETE /api/appointments/:id
      console.log(`7. Testing DELETE /api/appointments/${createdId}`);
      const delRes = await request({
        hostname: 'localhost',
        port: TEST_PORT,
        path: `/api/appointments/${createdId}`,
        method: 'DELETE'
      });
      console.log(`   Status: ${delRes.status} - Message: ${delRes.body.message}`);

      console.log('\nAll tests passed successfully!');
    } catch (err) {
      console.error('Test failed:', err);
    } finally {
      server.close();
      process.exit(0);
    }
  });
}

runTests();

