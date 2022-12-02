const express = require ('express');
const { Server: HttpServer } = require ('http');
const { Server: IOServer } = require ('socket.io');
const { engine } = require("express-handlebars")
const path = require("path")
const ProductControler = require("./controllers/productControler")
const productClass = new ProductControler()

// Instancio servidor, socket y api
const app = express(); 
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);
 
//middleware
app.use(express.static('./public'));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const PORT = process.env.PORT || 8080;

//array quemado:
const array_mensajes = [
    {nombre: 'Basti' , msj: '¡Hola!'},
    {nombre: 'Levi' , msj: '¡Hola, Basti, ¿como estás?!'},
    {nombre: 'Joel' , msj: '¡Hola a todos!'}
];

const Products = [
    { title: 'agua', price: 20, thumbnail: 'https://dummyimage.com/250/000/fff' }
]

////establecer coneccion del lado del back.
io.on('connection', socket =>{
    console.log("Nuevo cliente conectado.");
    
    // Le envio el historial de el array que ya tengo cuando un nuevo cliente se conecte
    socket.emit('message', array_mensajes)
    
    // una vez escuchamos al cliente y recibimos un mensaje, realizamos el envio a todos los demas pusheandolo a un array
    socket.on('mensaje nuevo', data =>{
        array_mensajes.push(data)
        
        //reenviamos por medio de broadcast los msj a todos los clientes que se conecten
        // el mismo nombre que enviamos desde el front
        io.sockets.emit('todos los mensajes', array_mensajes)

        // Le envio el historial de el array que ya tengo cuando un nuevo cliente se conecte
        socket.emit('Products', Products)

        socket.on('new-product', data => {
        Products.push(data)

        io.sockets.emit('Products', Products)
        })
    });

});


httpServer.listen( PORT , () =>{
    console.log(`server corriendo en el puerto ${PORT}`);
})

//Engine
app.engine(".hbs", engine({
    extname: ".hbs",
    defaultLayout: "tabla-productos.hbs",
    layoutsDir: path.join(__dirname, "/public/plantillas/tabla-productos"),
    partialsDir: path.join(__dirname, "../public/views/partials")
}))
app.set("view engine", "hbs")
app.set("views", path.join(__dirname, "/public/plantillas"))