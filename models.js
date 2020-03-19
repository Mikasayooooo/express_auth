const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/express_auth', {
    useNewUrlParser: true,
    useCreateIndex: true
})

const UserSchema = new mongoose.Schema({
    //唯一键 
    username: { type: String, unique: true },
    password: {
        type: String,
        set(val) {
            // 密码加密
            return require('bcrypt').hashSync(val, 10);
        }
    }
})

const User = mongoose.model('User', UserSchema)

//删除数据
// User.db.dropCollection('users')

//导出的是对象，导入的也是对象
module.exports = { User }