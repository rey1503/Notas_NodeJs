const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/usuarios', { useNewUrlParser: true, useUnifiedTopology: true,useCreateIndex:true })
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('Conexion a la base de datos');
});
connection.on('error', (err) => {
    console.log('error en la base de datos', err)
});
