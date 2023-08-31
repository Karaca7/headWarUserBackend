const init = require('./bootstrap.js')
const cors = require('@fastify/cors').default
// const logger = require('./pino-logger')
// const senMailConsumer = require('./utils/rabbitConsumer/sendMailConsumer.js')

// const resetPassword = require('./utils/rabbitConsumer/resetPassword.js')
const app = require('fastify')({logger:true})

app.register(cors, {
  origin: '*' // İzin vermek istediğiniz etki alanını buraya belirtin
})

init(app)
  .then(() => {
    app.listen('3000', () => {
      console.log('LİSTEN')
      //consumers
      // senMailConsumer()
      // resetPassword()
    })
  })
  .catch(error => {
    console.error('ERROR:', error)
  })