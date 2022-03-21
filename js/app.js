// Constructores
function Seguro(marca, year, tipo){
     this.marca = marca;
     this.year = year;
     this.tipo = tipo;
};

// Realizar la cotizacion con los datos
Seguro.prototype.cotizarSeguro = function(){
     /*
          1 = Americano 1.15
          2 = Asiatico 1.05
          3 = Europeo 1.35
     */

     let cantidad;
     const base = 2000;
     
     switch(this.marca){
          case '1':
               cantidad = base*1.15;
               break;
          case '2':
               cantidad = base*1.05;
               break;
          case '3':
               cantidad = base*1.35;
               break;
          default: 
               break;
     };

     // Leer el year
     const diferencia = new Date().getFullYear() - this.year;

     // Cada year que la diferencia es mayor, el costo va a reducirse un 3%
     cantidad -= (((diferencia*3)*cantidad)/100);

     if(this.tipo === 'basico'){
          cantidad *= 1.30;
     }else{
          cantidad *= 1.50;
     }
     return cantidad;
};

function UI(){};

UI.prototype.llenarOpciones = () => {
     const max = new Date().getFullYear(),
          min = max-20;

     const selectYear = document.querySelector('#year');

     for(let i = max; i > min; i--){
          let option = document.createElement('option');
          option.value = i;
          option.textContent = i;
          selectYear.appendChild(option);
     }
};

// Muestra alertas

UI.prototype.mostrarMensaje = (mensaje, tipo) => {
     if(document.querySelectorAll('.error').length>0){
          document.querySelector('.error').remove();
     }
     const div = document.createElement('div');

     if(tipo === 'error'){
          div.classList.add('error');
     }else if(tipo === 'correcto'){
          div.classList.add('correcto');
          document.querySelector('button').disabled=true;
          document.querySelector('button').classList.add('cursor-not-allowed', 'opacity-50');

          setTimeout(()=>{
               div.remove();
               document.querySelector('button').disabled=false;
               document.querySelector('button').classList.remove('cursor-not-allowed', 'opacity-50');
          }, 3000)
     }

     div.classList.add('mensaje', 'mt-10');
     div.textContent = mensaje;

     // Insertar en el HTML
     const formulario = document.querySelector('#cotizar-seguro');
     formulario.insertBefore(div, document.querySelector('#resultado'));     
};

UI.prototype.mostrarResultado = (total, seguro) => {
     const {marca, year, tipo} = seguro;
     let textoMarca;

     switch(marca){
          case '1':
               textoMarca = 'Americano';
               break;
          case '2':
               textoMarca = 'Asiatico';
               break;
          case '3':
               textoMarca = 'Europeo';
               break;
          default:
               break;
     }

     const div = document.createElement('div');
     div.classList.add('mt-10');
     div.innerHTML = `
          <p class="header">Tu resumen</p>
          <p class="font-bold">Marca: <span class="font-normal">${textoMarca}</span></p>
          <p class="font-bold">Año: <span class="font-normal">${year}</span></p>
          <p class="font-bold">Tipo: <span class="font-normal capitalize">${tipo}</span></p>
          <p class="font-bold">Total: <span class="font-normal">$${total}</span></p>
     `;

     const resultadoDiv = document.querySelector('#resultado');
     
     const spinner = document.querySelector('#cargando');
     spinner.style.display = 'block';

     setTimeout(()=>{
          spinner.style.display = 'none';
          resultadoDiv.appendChild(div);
     },3000)
}

// Instanciar UI
const ui = new UI();


document.addEventListener('DOMContentLoaded', () => {
     ui.llenarOpciones();
});

eventListeners();
function eventListeners(){
     const formulario = document.querySelector('#cotizar-seguro');
     formulario.addEventListener('submit', cotizarSeguro);
};

function cotizarSeguro(e){
     e.preventDefault();

     // Leer la marca seleccionada
     const marca = document.querySelector('#marca').value;

     // Leer el year seleccionado
     const year = document.querySelector('#year').value;

     // Leer el tipo de cobertura
     const tipo = document.querySelector('input[name="tipo"]:checked').value;

     if(marca === '' || year === '' || tipo === ''){
          ui.mostrarMensaje('Todos los campos son obligatorios', 'error');
          return;
     };

     //Ocultar las cotizaciones previas
     const resultados = document.querySelector('#resultado div');
     if(resultados != null){
          resultados.remove();
     }

     ui.mostrarMensaje('Procesando...', 'correcto');

     // Instanciar el seguro
     const seguro = new Seguro(marca,year,tipo);
     const total = seguro.cotizarSeguro();

     // Utilizar el prototype que va a cotizar.
     ui.mostrarResultado(total, seguro);
}