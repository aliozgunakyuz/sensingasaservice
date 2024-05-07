const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const appletSchema = new Schema({
  appletName: { type: String, required: true },
  appletId: { type: String, required: true, unique: true },
  camList: [{ type: String }], 
  mlModelList: [{ type: String }], 
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

const Applet = mongoose.model('Applet', appletSchema);

module.exports = Applet;
