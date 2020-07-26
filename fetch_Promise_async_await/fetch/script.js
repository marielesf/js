window.addEventListener('load', function () {
  doFetch();
  doFecthAsync();
  executeDivisionPromise();
  executeDivisionPromiseAsyncAwait();
});

function doFetch() {
  fetch('https://api.github.com/users/marielesf').then((res) => {
    res
      .json()
      .then((data) => {
        showData(data);
      })
      .catch((error) => {
        console.log('erro na requisicao');
      });
  });
}

async function doFecthAsync() {
  const res = await fetch('https://api.github.com/users/marielesf');
  const json = await res.json();
  console.log('doFecthAsync', json);
}

function executeDivisionPromise() {
  divisionPromise(12, 0)
    .then((result) => {
      console.log(result);
    })
    .catch((errorNewpromise) => {
      console.log('Falha na divisao' + errorNewpromise);
    });
}

async function executeDivisionPromiseAsyncAwait() {
  const div = await divisionPromise(12, 2);
  console.log('Divisao Async: ', div);
}

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
