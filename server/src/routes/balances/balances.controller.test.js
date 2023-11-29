const { sequelize } = require('../../models')
const { mockRequest, mockResponse } = require('../../jest.helper')
const balancesController = require('./balances.controller')
const { HTTP_CODE_ERRORS } = require('../../core/constants')

const MOCK_CLIENT_ID = 2
describe('Balances controller', () => {
    it('should return status 400 with error message (deposit more than 25%)', async () => {
        const req = mockRequest()

        req.app.get
            .mockReturnValueOnce(sequelize.models)
            .mockReturnValueOnce(sequelize)

        req.params = {
            userId: MOCK_CLIENT_ID,
        }

        req.body = {
            amount: 1500,
        }

        const res = mockResponse()
        await balancesController.balanceDeposit(req, res)
        expect(res.json).toHaveBeenCalledWith({
            error: {
                status: HTTP_CODE_ERRORS.BAD_REQUEST,
                message:
                    'Deposit must not exceed 25% of the total unpaid jobs.',
            },
        })
    })

    it('should return 200 with amount of client', async () => {
        const req = mockRequest()

        req.app.get
            .mockReturnValueOnce(sequelize.models)
            .mockReturnValueOnce(sequelize)

        req.params = {
            userId: MOCK_CLIENT_ID,
        }

        req.body = {
            amount: 5,
        }

        const res = mockResponse()
        await balancesController.balanceDeposit(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
    })
})
