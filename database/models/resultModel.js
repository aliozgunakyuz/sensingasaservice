const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const resultSchema = new Schema({
  modelname: {
    type: String,
    required: true
  },
  camname: {
    type: String,
    required: true
  },
  response: {
    type: Schema.Types.Mixed,
    required: true
  },
  time: {
    type: Date,
    default: Date.now
  }
});

const ResultModel = mongoose.model('ResultModel', resultSchema);

module.exports = ResultModel;
