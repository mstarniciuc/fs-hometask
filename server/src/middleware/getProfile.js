const { HTTP_CODE_ERRORS } = require('../core/constants')

const getProfile = async (req, res, next) => {
    const { Profile } = req.app.get('models')
    const profile = await Profile.findOne({
        where: { id: req.get('profile_id') || 0 },
    })
    if (!profile) return res.status(HTTP_CODE_ERRORS.UNAUTHORIZED).end()
    req.profile = profile
    next()
}
module.exports = { getProfile }
