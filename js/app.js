const carrito = document.querySelector('#carrito');
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');
const listaCursos = document.querySelector('#lista-cursos');
let articulosCarrito = [];

cargarEventListener();
function cargarEventListener(){
    //Cuando agregas un curso presionando "Agregar al Carrito"
    listaCursos.addEventListener('click', agregarCurso);

    //Elimina cursos del carrito
    carrito.addEventListener('click', eliminarCurso)

    //Muestra los cursos del localStorage
    document.addEventListener('DOMContentLoaded', ()=>{
        articulosCarrito = JSON.parse(localStorage.getItem('carrito')) || [];
        carritoHTML();
    })

    //Vaciar el Carrito
    vaciarCarritoBtn.addEventListener('click', ()=>{
        articulosCarrito = []; // Reseteamos el arreglo
        limpiarHTML(); //Eliminamos todo el Html
    })
}

//Funciones
function agregarCurso(e){
    e.preventDefault();
    if(e.target.classList.contains('agregar-carrito')){
        const cursoSeleccionado = e.target.parentElement.parentElement //traversing, ir hasta el padre contenedor
        leerDatosCurso(cursoSeleccionado);
    }
}

//Elimina un curso del carrito
function eliminarCurso(e){    
    if(e.target.classList.contains('borrar-curso')){
        const cursoId = e.target.getAttribute('data-id');
        //Elimina del arreglo de articulosCarrito por el data-id
        articulosCarrito = articulosCarrito.filter( curso => curso.id !== cursoId);
        carritoHTML(); // Volvemos a iterar sobre el carrito y mostrar su HTML
    }
}

//Lee el contenido del HTML al que le dimos click y extrae la informacion del curso

function leerDatosCurso(curso){    
    //Creamos un objeto con el contenido del curso actual seleccionado
    const infoCurso = {
        imagen: curso.querySelector('img').src,
        titulo: curso.querySelector('h4').textContent,
        precio: curso.querySelector('.precio span').textContent,
        id: curso.querySelector('a').getAttribute('data-id'),
        cantidad: 1
    }
    // Revisa si un elemento ya existe en el carrito
    const existe = articulosCarrito.some( curso => curso.id === infoCurso.id) //some para iterar sobre un arreglo y buscar un elemento
    if(existe){
        //Actualizamos la cantidad
        const cursos = articulosCarrito.map( curso => {
            if(curso.id === infoCurso.id){
                curso.cantidad++;
                return curso; // retorna el objeto actualizado
            }else{
                return curso; // retorna los objetos que no son los duplicados
            }
        });
        articulosCarrito = [...cursos];
    } else {
        articulosCarrito = [...articulosCarrito, infoCurso];
    }

    //Agrega elementos al arreglo  
    carritoHTML();
}

//Muestra el carrito de compras en el HTML

function carritoHTML(){

    // Limpiar el HTML
    limpiarHTML();
    //Recorre el carrito y genera el HTML
    articulosCarrito.forEach(curso=>{
        
        const {imagen,titulo,precio,cantidad,id} = curso; //Destructuring
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <img src="${imagen}" width="100">
            </td>
            <td>${titulo}</td>
            <td>${precio}</td>
            <td>${cantidad}</td>
            <td><a href="#" class="borrar-curso" data-id="${id}"> X </td>
        `;

        //Agrega el HTML del carrito en el tbdoy
        contenedorCarrito.appendChild(row)
    })
    //Agregar el carrito al LocalStorage
    sincronizarStorage();
}
function limpiarHTML(){
    // Forma lenta
    //contenedorCarrito.innerHTML = '';

    while(contenedorCarrito.firstChild){
        contenedorCarrito.removeChild(contenedorCarrito.firstChild)
    }
    localStorage.setItem('carrito',[]);
}
function sincronizarStorage(){
    localStorage.setItem('carrito', JSON.stringify(articulosCarrito));
}