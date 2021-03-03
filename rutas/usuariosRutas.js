const express = require('express');
const bcrypt = require('bcrypt');
const ruta = express.Router();
const Producto = require('../modelos/productoModelo');
const Usuario = require('../modelos/usuarioModelo');
git
ruta.post('/login', (req, res) => {
    let body = req.body;
    Usuario.findOne({correo: body.correo},(err, usuarioDB)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                err: err
            })
        }
        if (!usuarioDB){
            return res.status(400).json({
                ok: false,
                err:{
                    message: "Usuario o contraseña incorrectos"
                }
            })
        }
        var result = (body.contrasena == usuarioDB.contrasena);
        if (result) {
             console.log("Password correct");
             var rol = (usuarioDB.rol=="vendedor");
             if(rol){
                 res.redirect('/mostrarProductos');
             }else{
                res.redirect('/productosVenta');
             }

        } else {
             console.log("Password wrong");
        }
        req.session.usuario = usuarioDB.correo;
    })
});
ruta.get('/sesion', (req, res) => {
    req.session.usuario = 'Fulanito';
    res.send("Sesion inciada");
});

ruta.get('/otra', (req, res) => {
    res.send("El ususario es: " + req.session.usuario);
});
ruta.get('/cerrar', (req, res) => {
    req.session.destroy();
    res.redirect('/index.html')
});


// const fs = require('fs');
// const { v4: uuidv4 } = require('uuid');
//---------------- REGISTRAR USUARIOS ------------------------

ruta.post('/registrarUsuario', (req, res) => {
    var usuario = new Usuario({
        usuario: req.body.usuario,
        correo: req.body.correo,
        contrasena:req.body.contrasena,
        rol:req.body.rol,
    });
    var resultado = usuario.save();

    resultado.then(prod => {
        res.redirect('/index.html');
    }).catch(err => {
        res.status(400).send("error")
    });
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
//------------BUSCAR USUARIO------------------------
ruta.post('/buscarUsuario', (req, res) => {
    var name = req.body.correo;
    var pass = req.body.contrasena;
    var resultado = Usuario.find({"correo":name});
    resultado
        .then(prod => {
            res.redirect('/productosVenta');
           /* if (prod.length > 0) {
                /*console.log(validado);
                if(validado){
                    res.send('contraseña correcta');
                    res.redirect('/productosVenta'); 
                }else{
                    res.send('contraseña mala');
                }
            } else {
                res.send('noooo');                                      
            }*/
        })
        .catch(err => {
            res.status(400).send('Error al realizar la consulta' + err);
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
        empresa: req.body.empresa,
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
    var productos = Producto.find({ "estado": true });
    productos.then(prod => {
            res.render('mostrarProductos', { productos: prod });
        })
        .catch(err => {
            res.status(400).send("Error al extraer la informacion");
        });
});

// ----------------- MOSTRAR PRODUCTOS API-------------------------
ruta.get('/api/mostrarProductos', (req, res) => {
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


//-------------------------------------------------INTERFAZ DEL COMPRADOR--------------------------------
// ----------------- MOSTRAR  -------------------------
ruta.get('/productosVenta', (req, res) => {
    var productos = Producto.find({ "estado": true });
    productos.then(prod => {
            res.render('productosVenta', { productos: prod });
        })
        .catch(err => {
            res.status(400).send("Error al extraer la informacion");
        });
});

// ----------------- MOSTRAR PRODUCTOS API-------------------------
ruta.get('/api/productosVenta', (req, res) => {
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

module.exports = ruta;