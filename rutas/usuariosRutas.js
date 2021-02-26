const express = require('express');
const ruta = express.Router();
const Producto = require('../modelos/productoModelo');
const Usuario = require('../modelos/usuarioModelo');

ruta.get('/login', (req, res) => {
    res.render('login');
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
    res.send("Sesion Cerrada");
});


// const fs = require('fs');
// const { v4: uuidv4 } = require('uuid');

//---------------- INSERTAR REGISTROS ------------------------

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
//---------------- REGISTRAR USUARIOS ------------------------

ruta.post('/registrarUsuario', (req, res) => {
    var usuario = new Usuario({
        usuario: req.body.usuario,
        correo: req.body.correo,
        contrasena:req.body.contrasena,
    });
    var resultado = usuario.save();
    resultado
        .then(prod => {
            res.redirect('/mostrarProductos')
        }).catch(err => {
            res.status(400).send("Ocurrio un error al guardar el registro"+ err)
        })
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
module.exports = ruta;