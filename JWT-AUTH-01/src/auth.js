const dotenv = require('dotenv')
dotenv.config()
const JWT = require('jsonwebtoken')

const authenticate_token = (req, res, next) => {
  /* 通过 http 请求获取 authorization 字段 */
  const auth_header = req.headers['authorization']
  /* 该字段分为两部分，<type> <token> */
  const auth_type = auth_header && auth_header.split(' ')[0]
  const auth_token = auth_header && auth_header.split(' ')[1]

  /* 如果该字段没有，那么返回 401，401意味着未认证 */
  if (!auth_header || !auth_token) return res.sendStatus(401)

  if (auth_type === 'Bearer') {
    JWT.verify(auth_token, process.env.ACCESS_SECRET, (err, user) => {
      if (err) return res.sendStatus(403)
      req.user = user
      next();
    })
  }
}

module.exports = { authenticate_token }