const {
    CONTRACT_STATUS,
    HTTP_CODE_ERRORS,
    MAX_DEPOSIT_AMOUNT_COEFFICIENT,
} = require('../../core/constants')
const HttpError = require('../../core/http.error')

async function balanceDeposit(req, res) {
    const { userId } = req.params
    const { amount } = req.body

    const { Profile, Job, Contract } = req.app.get('models')
    const sequelize = req.app.get('sequelize')

    const balanceTransaction = await sequelize.transaction()

    try {
        const clientProfile = await Profile.findOne({
            where: { id: userId },
            transaction: balanceTransaction,
        })

        if (!clientProfile && clientProfile.type !== 'client') {
            throw new HttpError(
                'Client not found or permission forbidden.',
                HTTP_CODE_ERRORS.FORBIDDEN
            )
        }

        const unpaidJobsTotal = await Job.sum('price', {
            include: [
                {
                    model: Contract,
                    as: 'Contract',
                    where: {
                        status: CONTRACT_STATUS.IN_PROGRESS,
                        ClientId: clientProfile.id,
                    },
                },
            ],
            where: { paid: null },
            transaction: balanceTransaction,
        })

        if (
            amount <= 0 ||
            amount > unpaidJobsTotal * MAX_DEPOSIT_AMOUNT_COEFFICIENT
        ) {
            throw new HttpError(
                'Deposit must not exceed 25% of the total unpaid jobs.',
                HTTP_CODE_ERRORS.BAD_REQUEST
            )
        }
        await clientProfile.increment(
            { balance: amount },
            { transaction: balanceTransaction }
        )

        clientProfile.balance += amount

        await balanceTransaction.commit()
        res.status(200).json({
            status: 'success',
            data: {
                balance: clientProfile.balance,
            },
        })
    } catch (error) {
        if (balanceTransaction) await balanceTransaction.rollback()
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
    balanceDeposit,
}
