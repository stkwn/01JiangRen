## JWT流程

![image-20220531100034745](D:\01GithubProjectsUpdates\01JiangRen\images\JWT01.PNG)



## Install 库文件

```
yarn add express cors dotenv ip jsonwebtoken json-server axios 
```

vscode中安装插件 REST Client



## 代码过程

### 01 创建genSecret.js 文件

该文件主要产生64位字符串的16进制密钥

```
const crypto = require("crypto");

const generate_secret= () =>{
    return crypto.randomBytes(64).toString('hex')
}

console.log(generate_secret());
```

### 02 在package.json添加scripts命令行

```
  "scripts": {
    "secret":"node genToken.js",
    "server":"nodemon server.js",
    "server2": "nodemon server2.js",
    "token": "node genToken.js",
    "dataServer": "json-server --watch ./src/data/db.json --port 12000"
  },
```

### 03 产生密钥，并写入.env文件

`yarn secret`,在屏幕中会打印出64位密钥.

创建.env文件，这是本地的环境文件，千万不要传递到git上。

再运行一次，`yarn secret`,会再产生一次随机。

```
ACCESS_SECRET=7a402c3f96fdc1b6c87d747b56a8816e45d5f2fa946a7de942f5914b8d881938ce3df0591e7a53b0d2f153de276585fd00268c2cf3f5139cf52a7470b9e48654

REFRESH_SECRET=d52603dad54a73775d8e12cc6702c954eeccdfcfd154d95ebd73251626250b4bc2598e105e54c32cf69110cc2df1205d08892d59da3a7021e071481450799ee9

PORT=9090
DATA_ADDRESS=http://localhost:12000

```

### 04 创建 server

```javascript
const express = require('express')
const cors = require('cors')
const ip = require('ip')
const dotenv = require('dotenv')

/** 开启 env 功能 */
dotenv.config()

const app = express()
app.use(cors({ origin: "*" }))
app.use(express.json())
const address = ip.address()
const port = process.env.PORT || 6060

app.listen(port, () => {
  console.log('http://%s:%s', address, port)
  console.log('http://%s:%s', 'localhost', port)
})
```

这时候，通过`yarn server`就可以把服务器开起来了。

打开浏览器，可以获得：Cannot GET / 的提示。

### 05 创建login文件和用户信息文件

在server.js中， 添加2行代码

```
/** Login */
const { login } = require('./src/login')
app.post('/login', login)

/** UserInfo */
const { user_info } = require('./src/userInfo')
```

创建src文件夹，并创建2个文件 login.js 和user Info.js

创建rest文件夹，并创建request.rest文件。

request.js

```
POST http://localhost:9090/login
Content-Type: application/json

{
  "username": "Petter"
}

###
GET http://localhost:9190/user_info
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiUGV0dGVyIiwiaWF0IjoxNjUzNzE2MjgzfQ.eCdIdWqSkOBIslDal9o44IVLSEacQHIajvrygLsTPvA
```

login.js

```javascript
const JWT = require('jsonwebtoken')

const login = (req, res) => {
  const username = req.body.username  //这里的username是从request.js来的

  const user = { name: username }

  //产生新的token
  const accessToken = JWT.sign(
    user,
    process.env.ACCESS_SECRET,
    // { expiresIn: "15s" }
  )

  res.json({ accessToken })
}

module.exports = { login }
```

**我们可以在request.rest 发送request，这时候会得到accessToken**

### 06 取得用户数据。模拟数据库。

创建userInfo.js 创建data目录，创建db.json(这是模拟用户数据库)。

userInfo.js

```
const dotenv = require('dotenv')
dotenv.config()

const axios = require('axios')

const user_info = (req, res) => {
  axios.get(process.env.DATA_ADDRESS + "/user")
    .then(response => {
      res.json(response.data)
}

module.exports = { user_info }
```

在server.js

```
const { user_info } = require('./src/userInfo')
app.get('/user_info', user_info);
```

### 07 开始做认证

创建auth.js文件

```javascript
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
```

更新server.js文件

```javascript
const { user_info } = require('./src/userInfo')
const { authenticate_token } = require('./src/auth')
app.get('/user_info',authenticate_token, user_info)
```

更新userInfo.js 取得个人用户数据

```javascript
    .then(response => {
      res.json(response.data.filter(user => user.name === req.user.name))
    })
```



**HTTP身份验证**

http://developer.mozilla.org/zh-CN/