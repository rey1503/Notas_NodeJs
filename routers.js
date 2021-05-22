const { Router } = require('express');
const router = Router();
const PassportLocal = require('passport-local').Strategy;
const passport = require('passport');
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const bodyParser = require('body-parser');
const Task = require('./task');
const Usuarios = mongoose.model('usuarios', {
  nombre: { type: String, required: true, unique: true },
  correo: { type: String, unique: true, required: true },
  contrasena: { type: Number, required: true },
  confirma: { type: Number, required: true }
});

const Notas = mongoose.model('notas', {
  usuario: { type: String },
  titulo: { type: String },
  mensaje: { type: String },
  status: { type: String }
});
passport.use(new PassportLocal(async function (username, password, done) {
  const usuarios = await Usuarios.find({ nombre: username })
    .then(doc => {
      const datos = doc;
      if (doc == '') {
        console.log('nou');
        done(null, false);
      }
      datos.forEach(datos => {
        const pass = parseInt(password);
        if (datos.nombre === username) {
          if (datos.contrasena === pass) {
            return done(null, { id: datos.id, nombre: datos.nombre });
          } else {
            done(null, false);
          }
        }
      });
    })
}));
passport.serializeUser(function (user, done) {
  done(null, user.id);
});
passport.deserializeUser(async function (id, done) {
  await Usuarios.findById(id, function (err, user) {
    done(err, user);
  });
})
router.get('/salida', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});
router.get('/', (req, res) => {
  res.render('indexx.ejs', { menssage: req.flash('mensaje') });
});
router.get('/registrarse', (req, res) => {
  res.render('index.ejs', { menssage: req.flash('mensaje') });
});
router.post('/inicio', passport.authenticate('local', {
  successRedirect: "/aa",
  failureRedirect: '/aaa'
}));
router.get('/aa', (req, res, next) => {
  if (req.isAuthenticated()) return next();
  req.flash('mensaje', ' Primero tienes que iniciar sesion ');
  res.redirect('/');
}, (req, res) => {
  res.render('aa.ejs', { menssage: req.user.nombre });
});
router.get('/new', (req, res, next) => {
  if (req.isAuthenticated()) return next();
  req.flash('mensaje', ' Primero tienes que iniciar sesion ');
  res.redirect('/');
}, (req, res) => {
  Notas.find({ usuario: req.user.id })
    .then(doc => {
      res.json({ response: 'success', data: doc });
    })
    .catch(err => {
      console.log('Eroor al consultar datos', err.message);
      res.status(400).json({ response: 'failed' });
    });
});
router.get('/aaa', (req, res) => {
  req.flash('mensaje', ' usuario y contraseña invalida ');
  res.redirect('/');
});
router.post('/registro', (req, res) => {
  const usuarios = new Usuarios({ nombre: req.body.nombre, correo: req.body.correo, contrasena: req.body.contra, confirma: req.body.conqa });
  if (req.body.contra === '' && req.body.conqa === '') {
    req.flash('mensaje', ' Ingresa contraseña');
    res.redirect('/registrarse');
  } else if (req.body.nombre === '') {
    req.flash('mensaje', ' Ingresa tu nombre de usuario');
    res.redirect('/registrarse');
  } else if (req.body.correo === '') {
    req.flash('mensaje', ' Ingresa un correo');
    res.redirect('/registrarse');
  }
  if (req.body.contra === req.body.conqa) {
    usuarios.save().then(doc => {
      req.flash('mensaje', ' usuario guardado ');
      res.redirect('/');
    })
      .catch(err => {
        req.flash('mensaje', ' El usuario y/o el correo ya fueron registrados');
        res.redirect('/registrarse');
      })
  } else {
    req.flash('mensaje', ' Las contrase単as no coinciden ');
    res.redirect('/registrarse');
  }
});
router.get('/agregar', (req, res, next) => {
  if (req.isAuthenticated()) return next();
  req.flash('mensaje', ' Primero tienes que iniciar sesion ');
  res.redirect('/');
}, (req, res) => {
  res.render('formulario.ejs');
});
router.post('/nota', (req, res, next) => {
  if (req.isAuthenticated()) return next();
  req.flash('mensaje', ' Primero tienes que iniciar sesion ');
  res.redirect('/');
}, (req, res) => {
  const notas = new Notas({ usuario: req.user.id, titulo: req.body.titulo, mensaje: req.body.tarea, status: req.body.status });
  notas.save().then(doc => {
    req.flash('mensaje', ' tarea guardada ');
    res.redirect('/aa');
  })
    .catch(err => {
      console.log('no se guardo');
    })

});
router.get('/delete/:id/', (req, res, next) => {
  if (req.isAuthenticated()) return next();
  req.flash('mensaje', ' Primero tienes que iniciar sesion ');
  res.redirect('/');
}, (req, res) => {
  const id = req.params.id;
  Notas.findByIdAndDelete({ _id: id })
    .then(doc => {
      res.redirect('/aa');
    });
});
router.get('/pendientes', (req, res, next) => {
  if (req.isAuthenticated()) return next();
  req.flash('mensaje', ' Primero tienes que iniciar sesion ');
  res.redirect('/');
}, (req, res) => {
  Notas.find({ status: 'Pendiente' })
    .then(doc => {
      res.json({ response: 'success', data: doc });
    })
    .catch(err => {
      console.log('Eroor al consultar datos', err.message);
      res.status(400).json({ response: 'failed' });
    });
});
router.get('/Vencido', (req, res, next) => {
  if (req.isAuthenticated()) return next();
  req.flash('mensaje', ' Primero tienes que iniciar sesion ');
  res.redirect('/');
}, (req, res) => {
  Notas.find({ status: 'Vencido' })
    .then(doc => {
      res.json({ response: 'success', data: doc });
    })
    .catch(err => {
      console.log('Eroor al consultar datos', err.message);
      res.status(400).json({ response: 'failed' });
    });
});
router.get('/Concluido', (req, res, next) => {
  if (req.isAuthenticated()) return next();
  req.flash('mensaje', ' Primero tienes que iniciar sesion ');
  res.redirect('/');
}, (req, res) => {
  Notas.find({ status: 'Concluido' })
    .then(doc => {
      res.json({ response: 'success', data: doc });
    })
    .catch(err => {
      console.log('Eroor al consultar datos', err.message);
      res.status(400).json({ response: 'failed' });
    });
});

router.get('/update/:id/',(req, res, next) => {
  if (req.isAuthenticated()) return next();
  req.flash('mensaje', ' Primero tienes que iniciar sesion ');
  res.redirect('/');
},(req, res) => {
 Notas.findById(req.params.id, (err,doc)=>{
   if(!err){
     res.render('prueba.ejs',{
       doc
     })
   }
})
});
router.post('/update/:id',(req, res, next) => {
  if (req.isAuthenticated()) return next();
  req.flash('mensaje', ' Primero tienes que iniciar sesion ');
  res.redirect('/');
},(req, res) => {
  const id=req.body.ide;
  const idU=req.body.ideU;
  const tt=req.body.textN;
  const desc= req.body.descN;
  const sta=req.body.staN;
// console.log(id,idU,tt,desc,sta);
  // console.log(req.body.ide,req.body.ideU,req.body.textN, req.body.descN, req.body.staN);
  Notas.findOneAndUpdate({_id: id},{$set: {usuario:idU,titulo: tt,mensaje: desc,status: sta}},{new: true},(err,doc)=>{  
    res.redirect('/aa');
    })
  });
   
module.exports = router;