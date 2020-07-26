window.addEventListener('load', function () {
  fetch('https://api.github.com/users/marielesf').then((res) => {
    res
      .json()
      .then((data) => {
        showData(data);
      })
      .catch((error) => {
        console.log('erro na requisicao');
      });
    divisionPromise(12, 0)
      .then((result) => {
        console.log(result);
      })
      .catch((errorNewpromise) => {
        console.log('Falha na divisao' + errorNewpromise);
      });
  });
});

function showData(data) {
  const user = document.querySelector('#user');
  user.textContent = data.login + ' ' + data.name;
}

function divisionPromise(a, b) {
  return new Promise((resolve, reject) => {
    if (b === 0) {
      reject('Não é possivel dividir por 0');
    }
    resolve(a / b);
  });
}
