const { Op } = require('sequelize')
const { HTTP_CODE_ERRORS, CONTRACT_STATUS } = require('../../core/constants')
const HttpError = require('../../core/http.error')

async function getJobs(req, res) {
    const { Job, Contract } = req.app.get('models')
    const { contractor_id: contractorId } = req.query

    const jobs = await Job.findAll({
        include: [
            {
                attributes: [],
                model: Contract,
                required: true,
                where: {
                    ContractorId: contractorId,
                    status: CONTRACT_STATUS.IN_PROGRESS,
                },
            },
        ],
    })

    return res.json(jobs)
}
async function getUnpaidJobs(req, res) {
    const { Job, Contract } = req.app.get('models')

    const profileId = req.profile.id

    const jobs = await Job.findAll({
        include: [
            {
                attributes: [],
                model: Contract,
                required: true,
                where: {
                    [Op.or]: [
                        { ContractorId: profileId },
                        { ClientId: profileId },
                    ],
                    status: CONTRACT_STATUS.IN_PROGRESS,
                },
            },
        ],
        where: {
            paid: null,
        },
    })

    return res.json(jobs)
}

async function payForJob(req, res) {
    const { job_id } = req.params
    const { Job, Contract, Profile } = req.app.get('models')
    const sequelize = req.app.get('sequelize')
    const profileId = req.profile.id

    const paymentTransaction = await sequelize.transaction()

    try {
        const job = await Job.findByPk(job_id, {
            transaction: paymentTransaction,
        })

        if (!job) {
            throw new HttpError('Job not foud.', HTTP_CODE_ERRORS.NOT_FOUND)
        }

        if (job.paid) {
            throw new HttpError(
                'Job is already paid for.',
                HTTP_CODE_ERRORS.BAD_REQUEST
            )
        }

        const contract = await Contract.findByPk(job.ContractId, {
            transaction: paymentTransaction,
        })

        if (
            contract.ClientId !== profileId ||
            contract.status !== 'in_progress'
        ) {
            throw new HttpError(
                "Payment for job can't be processed",
                HTTP_CODE_ERRORS.FORBIDDEN
            )
        }

        const client = await Profile.findByPk(profileId, {
            transaction: paymentTransaction,
        })

        if (client.balance < job.price) {
            throw new HttpError(
                'Insufficient balance to pay for this job.',
                HTTP_CODE_ERRORS.BAD_REQUEST
            )
        }

        const contractor = await Profile.findByPk(contract.ContractorId, {
            transaction: paymentTransaction,
        })

        await client.decrement(
            { balance: job.price },
            { transaction: paymentTransaction }
        )

        await contractor.increment(
            { balance: job.price },
            { transaction: paymentTransaction }
        )

        job.paid = true

        await job.save({ transaction: paymentTransaction })

        await paymentTransaction.commit()

        return res.status(200).json({
            status: 'success',
            data: {
                job,
                client,
            },
        })
    } catch (error) {
        if (paymentTransaction) await paymentTransaction.rollback()
        res.status(
            error.statusCode || HTTP_CODE_ERRORS.INTERNAL_SERVER_ERROR
        ).json({
            error: {
                status: error.statusCode,
                message: error.message,
            },
        })
    }
}

module.exports = {
    getJobs,
    getUnpaidJobs,
    payForJob,
}
