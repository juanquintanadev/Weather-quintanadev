// hay 3 piezas importantes en este proyecto que tenemos que seleccionar
// la parte del resultado
// el formulario
// y el contenedor principal

const container = document.querySelector('.container');
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');

// primero al cargar la pagina, esperamos el evento del submit y buscamos el clima
window.addEventListener('load', () => {
    formulario.addEventListener('submit', obtenerClima);
});

function obtenerClima(e) {
    e.preventDefault();

    // console.log('buscando el clima');

    // validamos los datos ingresados ya que las APIS requierne ciertos valores como ellos lo necesitan
    const ciudad = document.querySelector('#ciudad').value;
    const pais = document.querySelector('#pais').value;

    

    if(ciudad === '' || pais === '') {
        mostrarAlerta('todos los campos obligatorios');
        return;
    };

    console.log(ciudad, pais);

    // una vez validado todo consultamos a la api
    consultarAPI(ciudad, pais);
};

function mostrarAlerta(mensaje) {
    // verificamos a ver si esta el cartel de alerta, si no esta, mostrmos el mensaje
    const esta = document.querySelector('.alerta');

    if(!esta) {
        const alerta = document.createElement('div');
        alerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded', 'max-w-md', 'mx-auto', 'mt-6', 'text-center', 'alerta');
        alerta.innerHTML = `
            <strong class="font-bold">Error</strong>
            <span class="block">${mensaje}</span>
        `;
    
        container.appendChild(alerta);
    
        setTimeout(() => {
            alerta.remove();
        }, 3000);
        return;
    };
    
};

function consultarAPI(ciudad, pais) { // los datos que les pasamos a la api son datos necesarios para ejecutar correctamente la peticion
    const appID = '41478367a240ae40aac935200cdb8241';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appID}`;

    // console.log(url);

    spinner(); // llamamos el spinner cuando esta consultando la api y luego cuando encuentra los datos tambien se limpia el html en la respuesta del fetch

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(datos => {

            // limpiamos el html para que no quede nada
            limpiarHtml();

            if(datos.cod === '404') {
                mostrarAlerta('Ciudad no encontrada');
                return;
            };

            // pasamos la validacion del codigo de error
            mostrarHtml(datos);
        });
};

function limpiarHtml() {
    while(resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    };
};

function mostrarHtml(datos) {
    console.log(datos);
    const {main: { temp, temp_max, temp_min }, name} = datos;
    const temperatura = kelvinAcentigrados(temp);
    const temperaturaMaxima = kelvinAcentigrados(temp_max);
    const temperaturaMinima = kelvinAcentigrados(temp_min);

    const actual = document.createElement('p');
    actual.classList.add('font-bold', 'text-6xl');
    actual.innerHTML = `Actual: ${temperatura} &#8451`; // inner para utilizar la entidad de °c

    const maxima = document.createElement('p');
    maxima.classList.add('font-bold', 'text-xl');
    maxima.innerHTML = `Máxima: ${temperaturaMaxima} &#8451`;

    const minima = document.createElement('p');
    minima.classList.add('font-bold', 'text-xl');
    minima.innerHTML = `Mínima: ${temperaturaMinima} &#8451`;

    const nombreCiudad = document.createElement('p');
    nombreCiudad.classList.add('text-bold', 'text-2xl');
    nombreCiudad.textContent = name;

    const resultadoDiv = document.createElement('div');
    resultadoDiv.classList.add('text-center', 'text-white');

    resultadoDiv.appendChild(nombreCiudad); 
    resultadoDiv.appendChild(actual);
    resultadoDiv.appendChild(maxima);
    resultadoDiv.appendChild(minima);

    resultado.appendChild(resultadoDiv);

    // resultado.innerHTML = `
    //     <p>Ciudad: ${name}</p>
    //     <p>Temperatura actual: ${temperatura}</p>
    //     <p>Temperatura maxima: ${temperaturaMaxima}</p>
    //     <p>Temperatura minima: ${temperaturaMinima}</p>
    // `;
};

// funciones llamadas helpers por JUAN DE LA TORRE
const kelvinAcentigrados = grados => parseInt(grados - 273.15); // aca vamos a obtener un numero en grados centigrados en numero entero

// vamos a crear el spinner con scripting
function spinner() {

    limpiarHtml(); // nos aseguramos que se limpie cualquier registro que haya previo

    const spinnerDiv = document.createElement('div');
    spinnerDiv.classList.add('sk-circle');
    
    spinnerDiv.innerHTML = `
        <div class="sk-circle1 sk-child"></div>
        <div class="sk-circle2 sk-child"></div>
        <div class="sk-circle3 sk-child"></div>
        <div class="sk-circle4 sk-child"></div>
        <div class="sk-circle5 sk-child"></div>
        <div class="sk-circle6 sk-child"></div>
        <div class="sk-circle7 sk-child"></div>
        <div class="sk-circle8 sk-child"></div>
        <div class="sk-circle9 sk-child"></div>
        <div class="sk-circle10 sk-child"></div>
        <div class="sk-circle11 sk-child"></div>
        <div class="sk-circle12 sk-child"></div>
    `;

    resultado.appendChild(spinnerDiv); // lo agregamos al resultado y mandamos a llamar a la funcion cuando esperamos la resupuesta de la api
};