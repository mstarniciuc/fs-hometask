const { sequelize } = require('../core/db')

// Models
const Profile = require('./profile.model')
const Job = require('./job.model')
const Contract = require('./contract.model')

//Relations
Profile.hasMany(Contract, { as: 'Contractor', foreignKey: 'ContractorId' })
Contract.belongsTo(Profile, { as: 'Contractor' })
Profile.hasMany(Contract, { as: 'Client', foreignKey: 'ClientId' })
Contract.belongsTo(Profile, { as: 'Client' })
Contract.hasMany(Job)
Job.belongsTo(Contract)

//Export
module.exports = {
    sequelize,
    Profile,
    Contract,
    Job,
}
