const { Op } = require('sequelize')
const {
    BEST_CLIENT_DEFAULT_LIMIT,
    HTTP_CODE_ERRORS,
    CONTRACT_STATUS,
} = require('../../core/constants')
const HttpError = require('../../core/http.error')

async function getBestProfession(req, res) {
    const { start, end } = req.query
    const { Job, Contract, Profile } = req.app.get('models')
    const sequelize = req.app.get('sequelize')

    if (new Date(end).getTime() < new Date(start).getTime()) {
        throw new HttpError('Invalid Date Range', HTTP_CODE_ERRORS.BAD_REQUEST)
    }

    const bestProfession = await Job.findAll({
        include: [
            {
                model: Contract,
                where: {
                    status: CONTRACT_STATUS.IN_PROGRESS,
                },
                include: [
                    {
                        model: Profile,
                        as: 'Contractor',
                        attributes: ['profession'],
                    },
                ],
            },
        ],
        where: {
            paid: true,
            paymentDate: {
                [Op.between]: [new Date(start), new Date(end)],
            },
        },
        attributes: [
            [sequelize.fn('SUM', sequelize.col('price')), 'totalEarnings'],
            [sequelize.col('Contract.Contractor.profession'), 'profession'],
        ],
        group: [sequelize.col('Contract.Contractor.profession')],
        order: [[sequelize.fn('SUM', sequelize.col('price')), 'DESC']],
        limit: 1,
    })

    if (bestProfession.length === 0) {
        throw new HttpError('No data found', HTTP_CODE_ERRORS.NOT_FOUND)
    }

    res.status(200).json({
        status: 'success',
        data: {
            profession: bestProfession[0].dataValues.profession,
            totalEarnings: bestProfession[0].dataValues.totalEarnings,
        },
    })
}

async function getBestClients(req, res) {
    const { start, end, limit = BEST_CLIENT_DEFAULT_LIMIT } = req.query
    const { Job, Contract, Profile } = req.app.get('models')
    const sequelize = req.app.get('sequelize')

    if (new Date(end).getTime() < new Date(start).getTime()) {
        throw new HttpError('Invalid Date Range', HTTP_CODE_ERRORS.BAD_REQUEST)
    }

    const bestClients = await Job.findAll({
        where: {
            paid: true,
            paymentDate: {
                [Op.between]: [new Date(start), new Date(end)],
            },
        },
        include: [
            {
                model: Contract,
                attributes: ['ClientId'],
                include: {
                    model: Profile,
                    as: 'Client',
                    attributes: ['id', 'firstName', 'lastName'],
                },
            },
        ],
        attributes: [[sequelize.fn('sum', sequelize.col('price')), 'paid']],
        group: ['Contract.ClientId'],
        order: [[sequelize.literal('paid'), 'DESC']],
        limit: parseInt(limit, 10),
    })

    const result = bestClients.map((client) => ({
        id: client.Contract.Client.id,
        fullName: `${client.Contract.Client.firstName} ${client.Contract.Client.lastName}`,
        paid: client.getDataValue('paid'),
    }))

    res.json({
        status: 'success',
        data: result,
    })
}

module.exports = {
    getBestProfession,
    getBestClients,
}
