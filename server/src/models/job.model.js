const { Model, TEXT, BOOLEAN, DATE, DECIMAL } = require('sequelize')
const { sequelize } = require('../core/db')

class Job extends Model {}
Job.init(
    {
        description: {
            type: TEXT,
            allowNull: false,
        },
        price: {
            type: DECIMAL(12, 2),
            allowNull: false,
        },
        paid: {
            type: BOOLEAN,
            default: false,
        },
        paymentDate: {
            type: DATE,
        },
    },
    {
        sequelize,
        modelName: 'Job',
    }
)

module.exports = Job
