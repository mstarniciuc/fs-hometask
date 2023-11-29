const express = require('express')

const { getProfile } = require('../../middleware/getProfile')
const { getUnpaidJobs, payForJob, getJobs } = require('./jobs.controller')

// https://${host}/jobs/${currentRouter}
const jobsRouter = express.Router()

jobsRouter.get('/', getProfile, getJobs)
jobsRouter.get('/unpaid', getProfile, getUnpaidJobs)
jobsRouter.post('/:job_id/pay', getProfile, payForJob)

module.exports = jobsRouter
