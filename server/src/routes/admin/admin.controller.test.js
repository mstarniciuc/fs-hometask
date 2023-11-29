const { sequelize } = require('../../models')
const { mockRequest, mockResponse } = require('../../jest.helper')
const adminController = require('./admin.controller')
const { HTTP_CODE_ERRORS } = require('../../core/constants')
const HttpError = require('http-errors')
describe('Admin controller', () => {
    it('should return best profession', async () => {
        let req = mockRequest()

        req.app.get
            .mockReturnValueOnce(sequelize.models)
            .mockReturnValueOnce(sequelize)

        req.query = {
            start: '2020-08-09',
            end: '2020-08-19',
        }

        let res = mockResponse()

        await adminController.getBestProfession(req, res)

        expect(res.status).toHaveBeenCalledWith(200)

        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            data: {
                profession: 'Programmer',
                totalEarnings: 2683,
            },
        })
    })

    it('should throw not found error Invalid Date Range', async () => {
        let req = mockRequest()

        req.app.get
            .mockReturnValueOnce(sequelize.models)
            .mockReturnValueOnce(sequelize)

        req.query = {
            start: '2020-08-10',
            end: '2020-01-01',
        }

        let res = mockResponse()

        await expect(
            adminController.getBestProfession(req, res)
        ).rejects.toThrow(new HttpError('Invalid Date Range'))
    })

    it('should return two clients', async () => {
        let req = mockRequest()

        req.app.get
            .mockReturnValueOnce(sequelize.models)
            .mockReturnValueOnce(sequelize)

        req.query = {
            start: '2020-08-09',
            end: '2020-08-18',
        }

        let res = mockResponse()

        await adminController.getBestClients(req, res)
        const result = [
            {
                id: 4,
                fullName: 'Ash Kethcum',
                paid: 2020,
            },
            {
                id: 2,
                fullName: 'Mr Robot',
                paid: 442,
            },
        ]

        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            data: result,
        })
    })
})
