const express = require('express')
const fs = require('fs')
const path = require('path')
const app = express()
const bodyParser = require('body-parser')
const mysql = require('mysql')
const moment = require('moment')

const conn = mysql.createConnection({
    host: '127.0.0.1',
    database: 'blog',
    user: 'root',
    password: 'root'
})

// 注册解析表单数据的中间件
app.use(bodyParser.urlencoded({
    extended: false
}))
// 设置 默认采用的模板引擎名称
app.set('view engine', 'ejs')
// 设置模板页面的存放路径
app.set('views', './views')

app.get('/', (req, res) => {
    res.render('index.ejs')
})
// 用户请求注册页面
app.get('/register', (req, res) => {
    res.render('./user/register.ejs')
})

//注册新用户
app.post('/register', (req, res) => {
    const body = req.body
    //判断用户是不是为空
    if (body.username.trim().length <= 0 || body.password.trim().length <= 0 || body.nickname.trim().length <= 0) {
        return res.send({
            msg: '请填写完整的数据!',
            status: 400
        })
    }
    //查询用户名是否重名
    const sql1 = 'select count(*) as count from myblog where username=?'
    conn.query(sql1, body.username, (err, result) => {
        if (err) return res.send({
            msg: '用户名查询失败',
            status: 500
        })
        if (result[0].count !== 0) return res.send({
            msg: '用户名已重名',
            status: 500
        })
        body.ctime = moment().format('YYYY-MM-DD HH-mm-ss')
        const sql2 = 'insert into myblog set ?'
        conn.query(sql2, body, (err, result) => {
            if (err) return res.send({
                msg: '注册新用户失败！',
                status: 504
            })
            if (result.affectedRows !== 1) return res.send({
                msg: '注册新用户失败！',
                status: 505
            })
            res.send({
                msg: '注册新用户成功！',
                status: 200
            })
        })
    })
})
//登录页面
app.post('/login', (req, res) => {
    const body = req.body
    const sql1 = 'select * from myblog where username=? and password=?'
    conn.query(sql1, [body.username, body.password], (err, result) => {
        if (err) return res.send({
            msg: '用户登录失败',
            status: 500
        })
        if (result.length !== 1) return res.send({
            msg: '用户登录失败',
            status: 502
        });
        res.send({
            msg: '用户登录成功',
            status: 200
        })
    })
})
//用户请求注册页面
app.get('/login', (req, res) => {
    res.render('./user/login.ejs')
})
//托管node_modules静态资源
app.use('/node_modules', express.static('./node_modules'))
app.listen(80, () => {
    console.log('sever running at http://127.0.0.1');
})