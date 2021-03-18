const express = require('express');
const bcrypt = require('bcrypt');
const ruta = express.Router();
//const puppeeter = require('pupee')
const Producto = require('../modelos/productoModelo');
const Usuario = require('../modelos/usuarioModelo');

ruta.post('/login', (req, res) => {
    let body = req.body;
    Usuario.findOne({correo: body.correo},(err, usuarioDB)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                err: err                
            })
        }

        if(usuarioDB){
        var result = (body.contrasena == usuarioDB.contrasena);
        if (result) {
            req.session.usuario = usuarioDB.correo;
             var rol = (usuarioDB.rol);
             if(rol== "vendedor"){
                 res.redirect('/mostrarProductos');
             }else if(rol=="cliente"){
                res.redirect('/productosVenta');
             }else if(rol=="admin"){
                res.redirect('/mostrarUsuarios');
             }

        } else {
            res.send('<script>alert("Contraseña Incorrecta"); location.href = "index.html";</script>')
        }
        
    }else{
        res.send('<script>alert("Usuario incorrecto"); location.href = "index.html";</script>')
       
    }
    })
});

ruta.get('/sesion', (req, res) => {
    req.session.usuario = 'Fulanito';
    res.send("Sesion inciada");
});

ruta.get('/cerrar', (req, res) => {
    req.session.destroy();
    res.redirect('/index.html')
});


// const fs = require('fs');
// const { v4: uuidv4 } = require('uuid');
//---------------- REGISTRAR USUARIOS ------------------------
ruta.post('/registrarUsuario', (req, res) => {
    let body = req.body;
    var usuario = new Usuario({
        usuario: req.body.usuario,
        correo: req.body.correo,
        contrasena: req.body.contrasena,
        rol: req.body.rol,
    });
    var correo = body.correo != Usuario.correo;
    if (correo) {
        res.send('<script>alert("Correo ya existente intente con otro"); location.href = "signIn.html";</script>');
    } else {
        var resultado = usuario.save();
        resultado.then(prod => {
            res.redirect('/index.html');
        }).catch(err => {
            res.status(400).send("error")
        });
    }
});

// ------------------- API REGISTRAR USUARIO ------------------
ruta.post('/api/registrarUsuario', (req, res) => {
    var usuario = new Usuario({
        usuario: req.body.usuario,        
        correo: req.body.correo,
        contrasena:req.body.contrasena,
    });
    var resultado = usuario.save();
    resultado.then(prod => {
        res.send("insertado");
    }).catch(err => {
        res.status(400).send("error")
    });
});

//---------------- INSERTAR PRODUCTOS ------------------------

ruta.post('/insertarProducto', (req, res) => {
    var producto = new Producto({
        producto: req.body.producto,
        imagen: req.body.imagen,
        descripcion:req.body.descripcion,
        precio: req.body.precio,
        cantidad: req.body.cantidad,
        categoria: req.body.categoria,        
        empresa: req.session.usuario,
        ventas: 0,
    });
    var resultado = producto.save();
    resultado
        .then(prod => {
            res.redirect('/mostrarProductos')
        }).catch(err => {
            res.status(400).send("Ocurrio un error al guardar el registro ")
        })
});

// ------------------- API INSERTAR ------------------
ruta.post('/api/insertarProducto', (req, res) => {
    var producto = new Producto({
        producto: req.body.producto,
        imagen:req.body.imagen,
        descripcion:req.body.descripcion,
        precio: req.body.precio,
        cantidad: req.body.cantidad,
        categoria: req.body.categoria,
        empresa: req.body.empresa,
        ventas: req.body.ventas,
    });
    var resultado = producto.save();
    resultado.then(prod => {
        res.send("insertado");
    }).catch(err => {
        res.status(400).send("error")
    });
});

// ----------------- MOSTRAR PRODUCTOS -------------------------
ruta.get('/mostrarProductos', (req, res) => {
    if(!req.session.usuario){
        res.redirect('index.html')
    }
    var productos = Producto.find({ "empresa": req.session.usuario});
    productos.then(prod => {
            res.render('mostrarProductos', { productos: prod });
        })
        .catch(err => {
            res.status(400).send("Error al extraer la informacion");
        });
    
});


// ----------------- MOSTRAR PRODUCTOS API-------------------------
ruta.get('/api/mostrarProductos', (req, res) => {
    if(!req.session.usuario){
        res.redirect('index.html')
    }
    var productos = Producto.find({ "estado": true });
    productos.then(prod => {
            res.json(prod);
        })
        .catch(err => {
            res.status(400).json("Error al extraer la informacion");
        });
});
//--------------------BUSCAR PRODUCTOS X ID--------------------------
ruta.get('/buscarId/:id', (req, res) => {
    var id = req.params.id;
    var resultado = Producto.findById(id);
    resultado
        .then(prod => {
            var productoArreglo = [];
            productoArreglo.push(prod);
            res.render('modificarProducto', { producto: productoArreglo });
        })
        .catch(err => {
            res.status(400).send("Error al realizar la consulta " + err);
        })
});
//--------------------API BUSCAR PRODUCTOS X ID--------------------------
ruta.get('api/buscarId/:id',(req,res)=>{
    var id=req.params.id;
    var resultado=Producto.findById(id);
    resultado
    .then(prod=>{
    var productoArreglo=[];
    productoArrreglo.push(prod);
    res.json(productoArreglo)
    })
    .catch(err =>{
        res.json(400).json("Error");
    })
});
//-------------------ACTUALIZAR------------------------------
ruta.post('/modificarDatos',(req,res)=>{
    var {id,producto,imagen,descripcion,precio,cantidad,categoria,empresa,ventas}=req.body;
    var resultado=Producto.findByIdAndUpdate(id,
        {
            $set:{
                producto,
                imagen,
                descripcion,
                cantidad,
                categoria,
                empresa,
                precio,
                ventas,
            }
        },
        {new:true}
        );
    resultado
    .then(prod=>{
        res.redirect('/mostrarProductos');
    })
    .catch(err=>{
        res.status(400).send("Error al realizar actualizacion "+err);
    });
});

//-------------------ACTUALIZAR API------------------------------
ruta.post('api/modificarDatos',(req,res)=>{
    var {id,producto,imagen,descripcion,precio,cantidad,categoria,empresa,ventas}=req.body;
    var resultado=Producto.findByIdAndUpdate(id,
        {
            $set:{
                producto,
                imagen,
                descripcion,
                cantidad,
                precio,
                categoria,
                empresa,
                ventas,
            }
        },{new:true});
    resultado
    .then(prod=>{
        res.json("Actualizado");
    })
    .catch(err=>{
        res.status(400).json("Error");
    });
});

//--------------ELIMINAR---------------------
ruta.get('/eliminar/:id', (req,res)=>{
    var id= req.params.id;
    var resultado = Producto.findByIdAndDelete(id);
    resultado
    .then(prod =>{
        res.redirect('/mostrarProductos');
    })
    .catch(err=>{
        res.sratus(400).send("Error al eliminar"+err);
    });

});
//--------------------BUSCAR PRODUCTOS X NOMBRE--------------------------
ruta.post('/buscar', (req, res) => {
    var name = req.body.buscar;
    var resultado = Producto.find({"producto":name});
    resultado
        .then(prod => {
            if (prod.length > 0) {
                res.render('mostrarproductos', { productos: prod });
               
            } else {
                res.render('objetoNoLocalizado', { alerta: name }); 
                                                    
            }
        })
        .catch(err => {
            res.status(400).send('Error al realizar la consulta' + err);
        });
});
//--------------------------------------------ADMINISTRADOR----------------------------------
// ----------------- MOSTRAR USUARIOS -------------------------
ruta.get('/mostrarUsuarios', (req, res) => {
    if(!req.session.usuario){
        res.redirect('index.html')
    }
    var usuarios = Usuario.find({ "estado": true });
    usuarios.then(user => {
            res.render('mostrarUsuario', { usuarios: user });
        })
        .catch(err => {
            res.status(400).send("Error al extraer la informacion");
        });
});

ruta.get('/mostrarProductosAdmin', (req, res) => {
    if(!req.session.usuario){
        res.redirect('index.html')
    }
    var productos = Producto.find({ "estado": true });
    productos.then(prod => {
            res.render('administrar', { productos: prod });
        })
        .catch(err => {
            res.status(400).send("Error al extraer la informacion");
        });
});


//--------------------BUSCAR USUARIOS X ID--------------------------
ruta.get('/buscarIDU/:id', (req, res) => {
    var id = req.params.id;
    var resultado = Usuario.findById(id);
    resultado
        .then(user => {
            var usuarioArreglo = [];
            usuarioArreglo.push(user);
            res.render('modificarUsuario', { usuario: usuarioArreglo });
        })
        .catch(err => {
            res.status(400).send("Error al realizar la consulta " + err);
        })
});
//-------------------ACTUALIZAR------------------------------
ruta.post('/modificarUsuarioDatos',(req,res)=>{
    var {id,usuario,correo,contrasena,rol}=req.body;
    var resultado=Usuario.findByIdAndUpdate(id,
        {
            $set:{
                usuario,
                correo,
                contrasena,
                rol,
            }
        },
        {new:true}
        );
    resultado
    .then(prod=>{
        res.redirect('/mostrarUsuarios');
    })
    .catch(err=>{
        res.status(400).send("Error al realizar actualizacion "+err);
    });
});
//--------------ELIMINARUSUARIO---------------------
ruta.get('/eliminarU/:id', (req,res)=>{
    var id= req.params.id;
    var name= req.params.usuario;
    var resultado = Usuario.findByIdAndDelete(id);
    resultado
    .then(user =>{
        res.redirect('/mostrarUsuarios');
    })
    .catch(err=>{
        res.sratus(400).send("Error al eliminar"+err);
    });

});
//-------------------------------------------------INTERFAZ DEL COMPRADOR--------------------------------
// ----------------- MOSTRAR  -------------------------
ruta.get('/productosVenta', (req, res) => {
    if(!req.session.usuario){
        res.redirect('index.html')
    }
    var productos = Producto.find({ "estado": true });
    productos.then(prod => {
            res.render('productosVenta', { productos: prod });
        })
        .catch(err => {
            res.status(400).send("Error al extraer la informacion");
        });
});

//ALIMENTACION
ruta.get('/alimentacion', (req, res) => {
    if(!req.session.usuario){
        res.redirect('index.html')
    }
    var productos = Producto.find({ "categoria": "alimentacion" });
    productos.then(prod => {
            res.render('alimentacion', { productos: prod });
        })
        .catch(err => {
            res.status(400).send("Error al extraer la informacion");
        });
});
//SALUD
ruta.get('/salud', (req, res) => {
    if(!req.session.usuario){
        res.redirect('index.html')
    }
    var productos = Producto.find({ "categoria": "farmacia" });
    productos.then(prod => {
            res.render('salud', { productos: prod });
        })
        .catch(err => {
            res.status(400).send("Error al extraer la informacion");
        });
});
//TECNOLOGIA
ruta.get('/tecnologia', (req, res) => {
    if(!req.session.usuario){
        res.redirect('index.html')
    }
    var productos = Producto.find({ "categoria": "tecnologia" });
    productos.then(prod => {
            res.render('tecnologia', { productos: prod });
        })
        .catch(err => {
            res.status(400).send("Error al extraer la informacion");
        });
});
// ----------------- MOSTRAR PRODUCTOS API-------------------------
ruta.get('/api/productosVenta', (req, res) => {
    if(!req.session.usuario){
        res.redirect('index.html')
    }
    var productos = Producto.find({ "estado": true });
    productos.then(prod => {
            res.json(prod);
        })
        .catch(err => {
            res.status(400).json("Error al extraer la informacion");
        });
});

//--------------------BUSCAR PRODUCTOS X ID--------------------------
ruta.get('/buscarIdProducto/:id', (req, res) => {
    var id = req.params.id;
    var resultado = Producto.findById(id);
    resultado
        .then(prod => {
            var productoArreglo = [];
            productoArreglo.push(prod);
            res.render('visualizaProducto', { producto: productoArreglo });
        })
        .catch(err => {
            res.status(400).send("Error al realizar la consulta " + err);
        })
});
//--------------------API BUSCAR PRODUCTOS X ID--------------------------
ruta.get('api/buscarIdProducto/:id',(req,res)=>{
    var id=req.params.id;
    var resultado=Producto.findById(id);
    resultado
    .then(prod=>{
    var productoArreglo=[];
    productoArrreglo.push(prod);
    res.json(productoArreglo)
    })
    .catch(err =>{
        res.json(400).json("Error");
    })
});
//--------------------BUSCAR PRODUCTOS X NOMBRE--------------------------
ruta.post('/buscarC', (req, res) => {
    var name = req.body.buscar;
    var resultado = Producto.find({"producto":name});
    resultado
        .then(prod => {
            if (prod.length > 0) {
                res.render('productosVenta', { productos: prod });
               
            } else {
                res.send('<script>alert("Producto no encontrado"); location.href = "/productosVenta";</script>'); 
                                                    
            }
        })
        .catch(err => {
            res.status(400).send('Error al realizar la consulta' + err);
        });
});

module.exports = ruta;