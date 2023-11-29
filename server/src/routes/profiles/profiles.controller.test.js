const { sequelize } = require('../../models')
const { mockRequest, mockResponse } = require('../../jest.helper')
const profilesController = require('./profiles.controller')
const { HTTP_CODE_ERRORS, PROFILE_TYPE } = require('../../core/constants')

const NON_EXIST_USER_ID = 12
describe('Profiles controller', () => {
    it('should return status 401 UNAUTHORIZED', async () => {
        const req = mockRequest()
        req.app.get
            .mockReturnValueOnce(sequelize.models)
            .mockReturnValueOnce(sequelize)
        req.body = {
            id: NON_EXIST_USER_ID,
        }
        const res = mockResponse()
        await profilesController.loginProfile(req, res)

        expect(res.status).toBeCalledWith(HTTP_CODE_ERRORS.UNAUTHORIZED)
    })

    it('should return array of profiles.', async () => {
        const { Profile } = sequelize.models
        let req = mockRequest()

        req.app.get
            .mockReturnValueOnce(sequelize.models)
            .mockReturnValueOnce(sequelize)
        req.query = {
            type: PROFILE_TYPE.CLIENT,
        }

        let res = mockResponse()

        await profilesController.getProfiles(req, res)
        const profiles = await Profile.findAll({
            where: { type: PROFILE_TYPE.CLIENT },
        })

        expect(res.status).toHaveBeenCalledWith(200)

        const result = res.json.mock.calls[0][0]

        expect(result.data.length).toBe(profiles.length)
    })
})
