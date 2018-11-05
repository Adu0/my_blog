const express = require('express')
const app = express()
// 设置 默认采用的模板引擎名称
app.set('view engine', 'ejs')
// 设置模板页面的存放路径
app.set('views', './views')

app.get('/', (req, res) => {
    res.render('index.ejs')
})
//托管node_modules静态资源
app.use('/node_modules',express.static('./node_modules'))
app.listen(80, () => {
    console.log('sever running at http://127.0.0.1');
})