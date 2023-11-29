const { sequelize } = require('../../models')
const { mockRequest, mockResponse } = require('../../jest.helper')
const jobsController = require('./jobs.controller')
const { HTTP_CODE_ERRORS, CONTRACT_STATUS } = require('../../core/constants')
const { Op } = require('sequelize')

const MOCK_CLIENT_ID = 1
describe('Jobs controller', () => {
    it('should return a client unpaid job.', async () => {
        const { Job, Contract } = sequelize.models
        let req = mockRequest()

        req.app.get
            .mockReturnValueOnce(sequelize.models)
            .mockReturnValueOnce(sequelize)

        req.query = {
            paid: false,
        }

        req.profile = {
            id: MOCK_CLIENT_ID,
        }

        let res = mockResponse()

        await jobsController.getUnpaidJobs(req, res)

        const result = res.json.mock.calls[0][0]
        const unPaidJob = await Job.findAll({
            include: [
                {
                    attributes: [],
                    model: Contract,
                    required: true,
                    where: {
                        [Op.or]: [
                            { ContractorId: MOCK_CLIENT_ID },
                            { ClientId: MOCK_CLIENT_ID },
                        ],
                        status: CONTRACT_STATUS.IN_PROGRESS,
                    },
                },
            ],
            where: {
                paid: null,
            },
        })

        expect(result.length).toBe(unPaidJob.length)
    })

    it("should pay for the client's job.", async () => {
        const { Profile, Job } = sequelize.models

        const clientId = 1
        const contractorId = 6
        const jobId = 2

        const client = await Profile.findByPk(clientId)
        const contractor = await Profile.findByPk(contractorId)
        const job = await Job.findByPk(jobId)

        let req = mockRequest()

        req.app.get
            .mockReturnValueOnce(sequelize.models)
            .mockReturnValueOnce(sequelize)

        req.params = {
            job_id: jobId,
        }

        req.profile = {
            id: clientId,
        }

        let res = mockResponse()

        await jobsController.payForJob(req, res)
        const paiedJob = await Job.findByPk(jobId)

        expect(res.json).toBeCalledWith({
            status: 'success',
            data: {
                job: paiedJob,
                client,
            },
        })

        const updatedClient = await Profile.findByPk(clientId)
        const updatedContractor = await Profile.findByPk(contractorId)

        expect(updatedClient.balance).toEqual(client.balance - job.price)

        expect(updatedContractor.balance).toEqual(
            contractor.balance + job.price
        )
    })

    it('should return error, Insufficient balance to pay for this job.', async () => {
        let req = mockRequest()

        req.app.get
            .mockReturnValueOnce(sequelize.models)
            .mockReturnValueOnce(sequelize)

        req.params = {
            job_id: 5,
        }

        req.profile = {
            id: 4,
        }

        let res = mockResponse()
        await jobsController.payForJob(req, res)
        expect(res.json).toBeCalledWith({
            error: {
                status: HTTP_CODE_ERRORS.BAD_REQUEST,
                message: 'Insufficient balance to pay for this job.',
            },
        })
    })
})
