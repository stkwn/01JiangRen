const JWT = require('jsonwebtoken')

const login = (req, res) => {
  const username = req.body.username

  const user = { name: username }

  const accessToken = JWT.sign(
    user,
    process.env.ACCESS_SECRET,
    // { expiresIn: "15s" }
  )

  res.json({ accessToken })
}

module.exports = { login }