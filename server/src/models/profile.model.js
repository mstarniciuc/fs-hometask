const { Model, STRING, ENUM, DECIMAL } = require('sequelize')
const { sequelize } = require('../core/db')
const { PROFILE_TYPE } = require('../core/constants')

/**
 * Profile Model
 * - firsName
 * - lastName
 * - balance
 * - type
 */
class Profile extends Model {}
Profile.init(
    {
        firstName: {
            type: STRING,
            allowNull: false,
        },
        lastName: {
            type: STRING,
            allowNull: false,
        },
        profession: {
            type: STRING,
            allowNull: false,
        },
        balance: {
            type: DECIMAL(12, 2),
        },
        type: {
            type: ENUM(PROFILE_TYPE.CLIENT, PROFILE_TYPE.CONTRACTOR),
        },
    },
    {
        sequelize,
        modelName: 'Profile',
    }
)

module.exports = Profile
