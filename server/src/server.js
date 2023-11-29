const app = require('./app')

const PORT = process.env.PORT || 3001

init()

async function init() {
    try {
        app.listen(PORT, () => {
            console.log('Express App Listening on Port 3001')
        })
    } catch (error) {
        console.error(`An error occurred: ${JSON.stringify(error)}`)
        process.exit(1)
    }
}
