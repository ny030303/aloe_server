const mongoose = require('mongoose');

const {Schema} = mongoose;
const userSchema = new Schema({
    id: {
        type: String,
        required:true,
        unique: true,
    },
    pwd: {
        type: String,
        required:true,
    },
    name: {
        type: String,
        required:true,
    },
    birth: {
        type: Number,
        required:true,
    },
    profileimg: String,
    memo: String,
    createdAt:{
        type: Date,
        default:Date.now,
    },
});

module.exports = mongoose.model('User', userSchema);