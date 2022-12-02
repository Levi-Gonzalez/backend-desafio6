//establecer coneccion del lado del front.
const socket = io.connect()

// configuracion socket productos

function addNewProduct() {
    //Primero capturo los datos del html
    const nombre = document.getElementById('nombre').value
    const precio = document.getElementById('precio').value
    const foto = document.getElementById('foto').value

    const newProduct = {
        title: nombre,
        price: precio,
        thumbnail: foto
    }

    // enviamos estos datos al server
    socket.emit('new-product', newProduct)

    return false
}

// Renderizamos los productos en el html

function renderProducts(data) {
    const html = data.map(product => {
        return (`<tr> <td><strong>${product.title}</strong></td> <td><em>$${product.price}</em></td> <td><img src="${product.thumbnail}" alt="foto del producto" class="productsImage"></td> </tr>`)
    }).join(' ')

    document.getElementById('productos').innerHTML = html
};

//______________________________________________________

function render (data){
    const html = data.map( item => {
        return (`<div> <strong> ${item.nombre} </strong>: <em> ${item.msj} </em></div>`)
    }).join(' ')

    document.getElementById("message_html").innerHTML = html
};

// funcion que se ejecuta cuando doy click al boton.
function addMensajes () {
    const autor_input = document.getElementById('autor').value;
    const txt_input = document.getElementById('msj').value;

    //gardo en un obj
    const mensaje_chat = {
        nombre: autor_input,
        msj: txt_input
    };;

    //Esto es para que una vez que enviemos el mensaje se limpie el input.
   document.getElementById('msj').value = ''
    
   
    //enviamos la data al server
    socket.emit('mensaje nuevo', mensaje_chat)
    return false

}


// evento para enviar y recibir mensajes: usaremos este porque queremos que se renderice en la posicion del rende.
socket.on('todos los mensajes', data => {
    render(data)
});

socket.on('Products', data => {
    renderProducts(data)
})