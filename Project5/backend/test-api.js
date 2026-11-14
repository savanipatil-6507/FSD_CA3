/**
 * Test script for Project 5 Backend with Sequelize
 */
const { sequelize, Appointment } = require('./models/Appointment');

async function testBackend() {
  console.log('Testing Project 5 Backend Database Integration...');
  try {
    await sequelize.authenticate();
    console.log('1. Database connected.');

    await sequelize.sync({ force: true });
    console.log('2. Models synchronized.');

    // Create record
    const created = await Appointment.create({
      appointmentNumber: 'APT-TEST',
      patientName: 'Jane Doe',
      patientPhone: '9876543210',
      department: 'Cardiology',
      doctorName: 'Dr. Test',
      appointmentDate: '2026-11-20',
      appointmentTime: '10:00',
      reason: 'Checkup',
      status: 'Scheduled'
    });
    console.log(`3. Created appointment ID: ${created.id} (#${created.appointmentNumber})`);

    // Fetch records
    const all = await Appointment.findAll();
    console.log(`4. Retrieved ${all.length} appointment(s) from database.`);

    // Update record
    created.status = 'Completed';
    await created.save();
    console.log(`5. Updated appointment status to: ${created.status}`);

    // Clean up
    await created.destroy();
    console.log('6. Deleted test record.');

    console.log('\nAll Project 5 database tests completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Test error:', err);
    process.exit(1);
  }
}

testBackend();

