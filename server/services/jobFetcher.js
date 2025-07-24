const axios = require('axios');
const parser = require('../utils/xmlParser');
const Job = require('../models/job_temp');
const ImportLog = require('../models/ImportLog');

const feeds = [
  'https://jobicy.com/?feed=job_feed',
  'https://jobicy.com/?feed=job_feed&job_categories=data-science'
];

module.exports.runImportJob = async () => {
  for (const url of feeds) {
    let log = {
      fileName: url,
      timestamp: new Date(),
      totalFetched: 0,
      totalImported: 0,
      newJobs: 0,
      updatedJobs: 0,
      failedJobs: []
    };

    try {
      const res = await axios.get(url);
      const json = parser(res.data);
      const items = json.rss.channel.item || [];

      log.totalFetched = items.length;
      for (const item of items) {
        const jobData = {
          jobId: item.guid || item.link,
          title: item.title,
          description: item.description,
          company: item['job:company'] || '',
          location: item['job:location'] || '',
          url: item.link,
          postedAt: new Date(item.pubDate)
        };
        try {
          const existing = await Job.findOne({ jobId: jobData.jobId });
          if (existing) {
            await Job.updateOne({ jobId: jobData.jobId }, jobData);
            log.updatedJobs++;
          } else {
            await new Job(jobData).save();
            log.newJobs++;
          }
          log.totalImported++;
        } catch (err) {
          log.failedJobs.push({ jobId: jobData.jobId, reason: err.message });
        }
      }
    } catch (err) {
      log.failedJobs.push({ jobId: 'all', reason: err.message });
    }
    await ImportLog.create(log);
  }
};
