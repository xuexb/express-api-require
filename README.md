# express-api-require

基于express的请求接口调用，把 `*.json` 定向到 `*.js` 里，以中间件形式写响应代码~

## 使用

### 安装

```bash
npm install express-api-require
```

### 运行

app.js

```js
const express = require('express')
const app = express()
const api = require('express-api-require')

// 注入
app.use(api({
    root: __dirname
}))

// 托管静态文件
app.use(express.static('./'))

app.listen(3000, () => console.log('Example app listening on port 3000!'))
```

api.js

```js
module.exports = (req, res, next) => {
    const data = {
        status: 'ok'
    }
    res.end(JSON.stringify(data))
}
```

data.json

```json
{}
```

请求路径 | 说明
--- | ---
`/api/data.json` | 因为真实文件存在，使用 `express.static` 直接响应
`/api/api.json` | 因为真实文件不存在，而 `api.js` 存在，走中间件模式
`/api/404.json` | 因为真实文件不存在，又没有找到 `404.js` ，走 `next()` 

## 扩展

支持配合其他中间件形式去处理响应，如配合 [res-json](https://www.npmjs.com/package/res-json) 支持响应 JSON 和 JSONP 数据：

```js
const express = require('express')
const app = express()
const api = require('express-api-require')
const json = require('res-json')

// 注入 res.json, res.jsonp 方法
app.use(json())

// 注入
app.use(api({
    root: __dirname
}))
```

## 配置

名称 | 类型 | 说明 | 默认值
--- | --- | --- | ---
root | `string` | 请求根目录 | `process.cwd()`
filter | `Function` | `request` 过滤器，返回 `false` 时将直接 `next()` 该请求 | `return true`
extMap | `Object` | 请求扩展名映射 | `{json: 'js'}`

## License
MIT