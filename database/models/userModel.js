const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  fullname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  appletIds: [{ type: Schema.Types.ObjectId, ref: 'Applet' }]
});


const User = mongoose.model('User', userSchema);

module.exports = User;
