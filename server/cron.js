const cron = require('node-cron');
const { runImportJob } = require('./services/jobFetcher');

cron.schedule('every hours', async () => {
  console.log('Running import...');
  await runImportJob();
});
