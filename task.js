const mongoose = require('mongoose');
const Schema =  mongoose.Schema;

const TaskSchema = new Schema({
    usuario: { type: String },
    titulo: { type: String },
    mensaje: { type: String },
    status: { type: String }
});


module.exports = mongoose.model('tasks' , TaskSchema);