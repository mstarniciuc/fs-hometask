const { Model, TEXT, ENUM } = require('sequelize')
const { sequelize } = require('../core/db')
const { CONTRACT_STATUS } = require('../core/constants')

class Contract extends Model {}
Contract.init(
    {
        terms: {
            type: TEXT,
            allowNull: false,
        },
        status: {
            type: ENUM(
                CONTRACT_STATUS.NEW,
                CONTRACT_STATUS.IN_PROGRESS,
                CONTRACT_STATUS.TERMINATED
            ),
        },
    },
    {
        sequelize,
        modelName: 'Contract',
    }
)

module.exports = Contract
