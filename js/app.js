const criptomonedasSelect =  document.querySelector("#criptomonedas");
const monedaSelect =  document.querySelector("#moneda");
const formulario = document.querySelector("#formulario");
const resultado = document.querySelector("#resultado")

const objBusqueda ={
  moneda: "",
  criptomoneda: ""
}


document.addEventListener("DOMContentLoaded", () =>{
  consultarCriptomonedas();
  formulario.addEventListener("submit", submitFormulario);

  criptomonedasSelect.addEventListener("change", leerValor);
  monedaSelect.addEventListener("change", leerValor);
  
})

function consultarCriptomonedas(){
  const url = "https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD";
  fetch(url)
    .then(respuesta => respuesta.json())
    .then(resultado => resultado.Data)
    .then(criptomonedas => SelectCriptomonedas(criptomonedas))
}


function SelectCriptomonedas(criptomonedas){
  criptomonedas.forEach(cripto => {
    const  { FullName, Name } = cripto.CoinInfo;
    
    const option = document.createElement("option");
    option.textContent = FullName;
    option.value = Name;
    criptomonedasSelect.appendChild(option);
  });
}

function leerValor(e){
  objBusqueda.criptomoneda = criptomonedasSelect.value;
  objBusqueda.moneda = monedaSelect.value;
}


function submitFormulario(e){
  e.preventDefault();
  //Validar

  const {moneda, criptomoneda} = objBusqueda;
  if(moneda === "" || criptomoneda === ""){
    mostrarAlerta("Ambos campos son obligatorios");
  }else{
    //Consultar la API con los resultados
    consultarAPI();
  }
}

function mostrarAlerta(msg){
  const existeError = document.querySelector(".error");
  if(!existeError){
    const divMensaje = document.createElement("div");
    divMensaje.classList.add("error");
    divMensaje.textContent = msg;
  
    formulario.appendChild(divMensaje);
  
    setTimeout( () =>{
      divMensaje.remove();
    }, 3000);
  }

}

function consultarAPI(){
  const {moneda, criptomoneda} = objBusqueda;
  const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`

  mostrarSpinner();

  fetch(url)
    .then(respuesta => respuesta.json())
    .then(cotizacion =>{
      mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda])
    })
}

function mostrarCotizacionHTML(cotizacion){
  limpiarHTML()
  const {PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE} = cotizacion

  const precio = document.createElement("p");
  precio.classList.add("precio");
  precio.innerHTML = `El precio es <span>${PRICE}</span>`

  const precioAlto = document.createElement("p");
  precioAlto.innerHTML = `<p>Precio más alto del día<span>${HIGHDAY}</span></p>`

  const precioBajo = document.createElement("p");
  precioBajo.innerHTML = `<p>Precio más bajo del día<span>${LOWDAY}</span></p>`

  const uHoras = document.createElement("p");
  uHoras.innerHTML = `<p>Variacion de las ultimas horas <span>${CHANGEPCT24HOUR} %</span></p>`

  const actulizacion = document.createElement("p");
  actulizacion.innerHTML = `<p>Ultima actualización <span>${LASTUPDATE} </span></p>`
  
  

  resultado.appendChild(precio)
  resultado.appendChild(precioAlto)
  resultado.appendChild(precioBajo)
  resultado.appendChild(uHoras)
  resultado.appendChild(actulizacion)
}

function limpiarHTML(){
  while(resultado.firstChild){
    resultado.removeChild(resultado.firstChild)
  }
}

function mostrarSpinner(){
  limpiarHTML();
  
  const spinner = document.createElement("div")
  spinner.classList.add("spinner")

  spinner.innerHTML =`
  <div class="dot1"></div>
  <div class="dot2"></div>
  `

  resultado.appendChild(spinner)
}