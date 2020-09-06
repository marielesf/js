let inputName = null;
let globalNames = [];
let curentIndex = null;
let isEditing = false;

window.addEventListener('load', () => {
  inputName = document.querySelector('#inputName');
  preventFormSubmit();
  activeInput();
});

function preventFormSubmit() {
  function handleForm(event) {
    event.preventDefault();
  }
  var form = document.querySelector('form');
  form.addEventListener('submit', handleForm);
}

function activeInput() {
  function insertName(newName) {
    //fazendo opracao de push com spread
    globalNames = [...globalNames, newName];
  }

  function updateName(newname) {
    globalNames[curentIndex] = newname;
  }

  function handleTyping(event) {
    if (
      event.key === 'Enter' &&
      !!event.target.value &&
      event.target.value.trim() !== ''
    ) {
      if (isEditing) {
        updateName(event.target.value);
      } else {
        insertName(event.target.value);
      }
      isEditing = false;
      render();
      clearInput();
    }
  }
  inputName.addEventListener('keyup', handleTyping);
  inputName.focus();
}

function render() {
  function createDeleteButton(index) {
    function deletename() {
      //remover um valor do array com filter - ignorando o primeiro parametro
      //filter tem como segundo parametro o indice que esta no array - representado por i
      globalNames = globalNames.filter((_, i) => i !== index);
      render();
    }
    var button = document.createElement('button');
    button.classList.add('deleteButton');
    button.textContent = 'Remove';
    button.addEventListener('click', deletename);
    return button;
  }

  function createSpan(name, index) {
    function editItem() {
      inputName.value = name;
      isEditing = true;
      curentIndex = index;
    }
    var sapn = document.createElement('span');
    sapn.classList.add('clickable');
    sapn.textContent = name;
    sapn.title = 'Click to edit';
    sapn.addEventListener('click', editItem);
    return sapn;
  }

  var divNames = document.querySelector('#names');
  divNames.innerHTML = '';
  var ul = document.createElement('ul');

  for (var i = 0; i < globalNames.length; i++) {
    var curentName = globalNames[i];
    var li = document.createElement('li');
    var button = createDeleteButton(i);
    var span = createSpan(curentName, i);
    li.appendChild(button);
    li.appendChild(span);
    ul.appendChild(li);
  }

  divNames.appendChild(ul);
}

//utilizando arrow functions
const clearInput = () => {
  inputName.value = '';
  inputName.focus();
};
