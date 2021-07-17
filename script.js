// Salvar Local Storage
const saveLocalStorage = () => {
  localStorage.setItem('cart', (document.querySelector('.cart__items').innerHTML));
  localStorage.setItem('total', (document.querySelector('#totalPrice').innerHTML));
};

// Código baseado no código do colega Rodrigo Merlon turma 12
// Update Price
const updatePrice = (price) => {
  const totalPrice = document.querySelector('.total-price');
  if (price === 0) totalPrice.innerHTML = 0;
  const currentPrice = Number(totalPrice.innerHTML);
  totalPrice.innerHTML = (price + currentPrice).toFixed(2);
};

// Remove Item do cart
function cartItemClickListener(event) {
  const string = event.target.previousSibling.innerHTML;
  const price = Number(string.split('$')[1]);
  updatePrice(-price);
  event.target.parentNode.remove();
  saveLocalStorage();
}

// Cria o elemento para adicionar ao carrinho
function createCartItemElement({ id, title, price, thumbnail }) {
  const li = document.createElement('li');
  li.id = id;
  li.className = 'cart__item';

  const img = document.createElement('img');
  img.src = thumbnail;

  const span = document.createElement('span');
  span.innerHTML = `SKU: ${id} </br> NAME: ${title} </br> PRICE: $${price}`;

  const icon = document.createElement('i');
  icon.className = 'far fa-trash-alt cart__icon';
  icon.addEventListener('click', cartItemClickListener);

  li.appendChild(img);
  li.appendChild(span);
  li.appendChild(icon);
  return li;
}

const getComputerIDPromise = async (computerID) => {
  const response = await fetch(`https://api.mercadolibre.com/items/${computerID}`);
  const computer = await response.json();
  const cart = document.querySelector('ol');
  cart.appendChild(createCartItemElement(computer));
  updatePrice(computer.price);
  // salvar no local storage
  saveLocalStorage();
}

const fetchComputerID = async (id) => {
  try {
    await getComputerIDPromise(id);
  } catch (error) {
    console.log(error);
  }
}

// Função para Adicionar item ao carrinho
const addToShoppingCart = (event) => {
  const id = event.target.parentNode.firstChild.innerHTML;
  const cart = document.querySelector('.cart');
  if (cart.style.display === 'none') cartVisible();
  return fetchComputerID(id);
};

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  if (element === 'button') e.addEventListener('click', addToShoppingCart);
  if (className === 'item__price') {
    e.innerText = `R$ ${innerText.toFixed(2)}`;
  } else {
    e.innerText = innerText;
  }
  return e;
}

function createinstallments(installments) {
  const span = document.createElement('span');
  span.className = 'item__installments';
  span.innerText = `${installments.quantity}x de R$ ${installments.amount} sem juros`;
  return span;
}

function createProductItemElement({ id, title, thumbnail, price, installments }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createCustomElement('span', 'item__price', price));
  section.appendChild(createinstallments(installments));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

// Tela de Loading
const Loading = (create) => {
  if (create === true) {
    const loadingSection = document.createElement('div');
    loadingSection.className = 'loadingModal';
    document.querySelector('body').appendChild(loadingSection);
    const div = document.createElement('div');
    div.className = 'loading';
    div.innerHTML = 'Carregando...';
    loadingSection.appendChild(div);
  } else {
    document.querySelector('.loadingModal').remove();
  }
};

const getComputerPromise = async (queryName) => {
  Loading(true);
  const response = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${queryName}`);
  const data = await response.json();

  const sectionPai = document.querySelector('.items');

  data.results.map((dataUnit) => sectionPai
    .appendChild(createProductItemElement(dataUnit)));
  
  return Loading(false);
}

// fetch Computer
const fetchComputer = async (query) => {
  try {
    await getComputerPromise(query);
  } catch (error) {
    console.log(error);
  }
};

// Limpa carrinho de compras
const eraseCart = () => {
  const cart = document.querySelector('ol');
  cart.innerHTML = '';
  updatePrice(0);
  localStorage.clear();
};

// Carrega o local Storage
const reloadCart = () => {
  document.querySelector('.total-price').innerHTML = localStorage.getItem('total');
  document.querySelector('ol').innerHTML = localStorage.getItem('cart');
  const listItens = document.querySelectorAll('.cart__item');
  return listItens.forEach((item) => item.addEventListener('click', cartItemClickListener));
};

// Pesquisar por categoria
const search = () => {
  const input = document.querySelector('.inputSearch');
  document.querySelector('.items').innerHTML = '';
  fetchComputer(input.value);
  document.querySelector('.inputSearch').value = '';
};

//Mostrar ou esconder carrrinho
const cartVisible = () => {
  const cart = document.querySelector('.cart');
  cart.style.display === 'none' ? cart.style.display = 'flex' : cart.style.display = 'none';
};

//Mostrar ou esconder Search Modal
const searchModalVisible = () => {
  const searchModal = document.querySelector('.searchModal');
  searchModal.style.display === 'none' ? searchModal.style.display = 'flex' : searchModal.style.display = 'none';
};

const searchModal = () => {
  const input = document.querySelector('.inputModalSearch').value;
  document.querySelector('.inputModalSearch').value = '';
  searchModalVisible();
  document.querySelector('.items').innerHTML = '';
  fetchComputer(input);
}

window.onload = function onload() {
  fetchComputer('Motorola');
  reloadCart();
  document.querySelector('.empty-cart').addEventListener('click', eraseCart);
  document.querySelector('.searchButton').addEventListener('click', search);
  document.querySelector('.removeCart').addEventListener('click', cartVisible);
  document.querySelector('.cartMobile').addEventListener('click', cartVisible);
  document.querySelector('.removeSearch').addEventListener('click', searchModalVisible);
  document.querySelector('.searchMobileButton').addEventListener('click', searchModalVisible);
  document.querySelector('.searchButtonModal').addEventListener('click', searchModal);
};