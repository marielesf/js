window.addEventListener('load', start);

function start(event) {
  console.log('pagina carregada');

  var inputR = document.querySelector('#rangeRed');
  var inputG = document.querySelector('#rangeGreen');
  var inputB = document.querySelector('#rangeBlue');

  inputR.addEventListener('change', moveSlidderR);
  inputG.addEventListener('change', moveSlidderG);
  inputB.addEventListener('change', moveSlidderB);
}

function moveSlidderR(event) {
  console.log(event);
  var valor = event.target.value;
  var input = document.querySelector('#inputRed');
  input.value = valor;
  changeColor();
}

function moveSlidderG(event) {
  console.log(event);
  var valor = event.target.value;
  var input = document.querySelector('#inputGreen');
  input.value = valor;
  changeColor();
}

function moveSlidderB(event) {
  console.log(event);
  var valor = event.target.value;
  var input = document.querySelector('#inputBlue');
  input.value = valor;
  changeColor();
}

function changeColor() {
  var inputR = document.querySelector('#inputRed');
  var inputG = document.querySelector('#inputGreen');
  var inputB = document.querySelector('#inputBlue');
  var div = document.querySelector('#color');
  div.style.backgroundColor =
    'rgb(' + inputR.value + ',' + inputG.value + ',' + inputB.value + ')';
}
