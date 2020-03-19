const express = require('express')

const app = express()

const jwt = require('jsonwebtoken')

app.use(express.json())

const SECRET = 'adgfdvxchrhetwafasc'

const { User } = require('./models')

//查数据
app.get('/api/users', async(req, res) => {
    const users = await User.find()
    res.send(users)
})

//注册
app.post('/api/register', async(req, res) => {
    // console.log(req.body);
    //注意json格式

    const user = await User.create({
        username: req.body.username,
        password: req.body.password
    })
    res.send(user)
})

// 登录
app.post('/api/login', async(req, res) => {
    const user = await User.findOne({
        username: req.body.username
    })

    if (!user) {
        return res.status(422).send({
            message: '用户名不存在yo'
        })
    }

    //密码校验
    const isPasswordValid = require('bcrypt').
    compareSync(
        req.body.password,
        user.password
    )

    if (!isPasswordValid) {
        return res.status(422).send({
            message: '密码错误yo'
        })
    }

    //生成token

    const token = jwt.sign({
        id: String(user._id) //可能是对象类型，需要强转
    }, SECRET)

    res.send({ user, token })
})

const auth = async(req, res, next) => {
    //获取token
    const raw = await String(req.headers.authorization).split(' ').pop()

    //验证解密
    const { id } = jwt.verify(raw, SECRET)

    req.user = await User.findById(id)

    next()
}


app.get('/api/profile', auth, async(req, res) => {
    // console.log(String(req.headers.authorization).split(' ').pop());

    res.send(req.user)
})

app.listen(4005, () => {
    console.log('http://localhost:4005');

})