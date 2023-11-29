const { PROFILE_TYPE, HTTP_CODE_ERRORS } = require('../../core/constants')

async function getProfiles(req, res) {
    let { type } = req.query
    type = type || PROFILE_TYPE.CLIENT
    const { Profile } = req.app.get('models')
    const profiles = await Profile.findAll({
        where: { type },
    })
    res.status(200).json({
        status: 'success',
        data: profiles,
    })
}

async function loginProfile(req, res) {
    const id = req.body.id
    const { Profile } = req.app.get('models')
    const profile = await Profile.findOne({
        where: { id },
    })

    if (!profile) return res.status(HTTP_CODE_ERRORS.UNAUTHORIZED)
    res.status(200).json({
        status: 'success',
        data: profile,
    })
}

module.exports = {
    getProfiles,
    loginProfile,
}
