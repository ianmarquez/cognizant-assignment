
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Employee = new Schema(
    {
      _id: { type: String, required: true },
      full_name: { type: String, required: true },
      login_id: { type: String, required: true, unique: true },
      salary: { type: Number, required: true },
      profile_pic: { type: String },
    },
    { timestamps: true },
)

module.exports = mongoose.model('employees', Employee)