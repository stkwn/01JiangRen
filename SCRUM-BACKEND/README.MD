# 后端-对应16期Tutorial7

## 安装

```
mkdir scrum-backend;
cd scrum-backend;
npm init -y
npm install axios body-parser cors dotenv express express-validator express-rate-limit mongoose nodemon --save


```

## 设计路径

index.js -》 loaders/index.js -》 express.js -》 app/routes/api.js  -》 app/controller/weather -》app/services/ => openweatherapi.js

## 文件结构

- APP
  - CONFIG
  - CONSTROLLERS
  - ROUTES
  - SERVICES
- LOADER
- ENV文件
  - .env（本地，不上传）
  - .env.expample
- index.js 程序入口

