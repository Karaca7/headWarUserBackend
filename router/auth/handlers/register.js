const { passwordHassing, verifyAuth } = require('../../../utils/password')
// const { connectToRabbitMQ } = require('../../../../utils/rabbitChannelGenrate.js')

// const sendMail = require('../../../../utils/mailler.js')
// const QUEUE_NAME = 'userVerify'

exports.schemas = {
  body: {
    type: 'object',
    properties: {
      userName: { type: 'string', minLength: 1 },
      name: { type: 'string', minLength: 1, maxLength: 60 },
      sureName: { type: 'string', minLength: 1, maxLength: 60 },
      password: { type: 'string', minLength: 6, maxLength:  120, pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*.])' },
      email: { type: 'string', format: 'email' },
     
    },
    required: ['name', 'email', 'password']
  },
 
}

// Not:async isteklerde next/done kullanmak prehandler da atıklan isteği tekrar handler a gönderiyor handlerda async olduğu için
// bundan dolayı done pre handlerda done yeriine return kullanmak gerekli.
exports.preHandler = async (req, res, done) => {
  try {
    const user = req.body

    const result = await req.db('users').select('email', 'userName').where({ email: user.email }).orWhere({ userName: user.userName }).first()
    if (result) {
      let confiltList = compareObjects(user, result)
      return res.badRequest(`Geçersiz istek: Lütfen bu alanları kontrol edin ${confiltList}`)
    }
    return
  } catch (error) {
    res.serverError('500')
  }
}

exports.handler = async (req, res) => {
  try {
    const AMOUNT = 1
    const user = req.body
    const password = await passwordHassing(user.password)
    // const verifyC = generateRandomCode()
    let newUser = {
      userName: user?.userName,
      password: password,
      email: user.email,
      name: user?.name,
      sureName: user?.userName,
     
    }
   
    let result = await req.db.transaction(async trx => {
      try {
        let createdUserId = await trx('users').insert(newUser)
        await trx.commit()

        // sendMail(user.email, 'kayıt doğrulama', verifyUrl)
      } catch (error) {
        await trx.rollback()
        console.error('Transaction failed:', error)
      }
    })

    return res.success('Kayıt Başarılı')
  } catch (error) {
    console.log(error)
    return res.badRequest('500')
  }
}

const compareObjects = (obj1, obj2) => {
  const commonFields = []

  for (let field in obj1) {
    if (obj1.hasOwnProperty(field) && obj2.hasOwnProperty(field == 'userName' ? 'userName' : field)) {
      if (obj1[field] === obj2[field]) {
        commonFields.push(field)
      }
    }
  }

  return commonFields
}

let channelPromise = null

async function getSendMailChannel() {
  if (!channelPromise) {
    channelPromise = await connectToRabbitMQ(QUEUE_NAME)
  }
  return channelPromise
}
