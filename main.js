const apiGpsLora = "https://piloto-gps-lora.vercel.app/api/gps/1";
const apiPanicoLora = "https://piloto-gps-lora.vercel.app/api/panico/1";

const botonActualizar = document.querySelector(".actualizar");
const botonUbicar = document.querySelector(".ubicar");
const busGps = document.getElementById("bus-gps");
const latitudGps = document.getElementById("latitud-gps");
const longitudGps = document.getElementById("longitud-gps");
const fechaGps = document.getElementById("fecha-gps");
const horaGps = document.getElementById("hora-gps");
const velocidadGps = document.getElementById("velocidad-gps");
const mapa = document.querySelector(".info-mapa");
const busPanico = document.getElementById("bus-panico");
const fechaPanico = document.getElementById("fecha-panico");
const horaPanico = document.getElementById("hora-panico");
const botonPanico = document.getElementById("boton-panico");

let latitud = 0, longitud = 0;
let map, Icono, marcadorMapa;

function inicializandoMapa(){
    map = L.map('map', {
        center: [-1.293557, -78.351483],
        zoom: 6
    });

    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
        maxZoom: 18
    }).addTo(map);

    L.control.scale().addTo(map);
    Icono = L.icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/512/3448/3448339.png",
        iconSize: [40, 50],
        iconAnchor: [25, 50],
    });
}

function inicializar () {
    inicializandoMapa();
    botonActualizar.addEventListener("click", actualizar);
    botonUbicar.addEventListener("click", ubicar);
    setInterval(actualizar,60000);  
}

function actualizar() {
    //alert("Actualizar pagina");
    apiPanico();
    apiGps();
}

function ubicar() {
    //alert("Ubicar Bus");
    //latitud=-2.426871;
    //longitud=-79.923214;
    if (latitud != 0 && longitud !=0 ) {
        window.open(`https://maps.google.com/?q=${latitud || -2.12155},${longitud || -79.92345}`);
    }
}

async function apiGps () {
    try {
        const response = await fetch(apiGpsLora, {cache: 'no-cache'});
        if ( response.ok ) {
            const jsonResponse = await response.json();
            pintarDatosGps(jsonResponse.data[0]);
        }
    } catch (error) {
        console.log(error);        
    }
}

function pintarDatosGps(gps) {
    if (marcadorMapa) {
        marcadorMapa.remove(); // remover Marcador de mapa
    }
    busGps.innerText = gps.bus;
    latitudGps.innerText = gps.latitud;
    longitudGps.innerText = gps.latitud;
    fechaGps.innerText = gps.fecha;
    horaGps.innerText = gps.hora;
    velocidadGps.innerText = gps.velocidad;
    latitud = gps.latitud;
    longitud = gps.longitud;
    marcadorMapa=L.marker([latitud, longitud],{title:gps.bus,draggable: false,opacity: 1,icon: Icono}).addTo(map);
    map.setView([latitud, longitud], 16);
}

async function apiPanico () {
    try {
        const response = await fetch(apiPanicoLora, {cache: 'no-cache'});
        if ( response.ok ) {
            const jsonResponse = await response.json();
            pintarDatosPanico(jsonResponse.data[0]);
        }
    } catch (error) {
        console.log(error);        
    }
}

function pintarDatosPanico(panico) {
    busPanico.innerText = panico.bus;
    fechaPanico.innerText = panico.fecha;
    horaPanico.innerText = panico.hora;
    if (panico.boton) {
        botonPanico.innerText = "S.O.S";
        botonPanico.style="background-color: red";
    } else {
        botonPanico.innerText = "OK";
        botonPanico.style="background-color: #dadee1";
    }
}

window.addEventListener('load',inicializar);
