// coisos pruncipais
const container = document.querySelector(".cart-items");
const subtotalElement = document.getElementById("subtotal");
const freteElement = document.getElementById("frete");
const totalGeralElement = document.getElementById("total-geral");

const freteFixo = 20;


function renderCarrinho() {
  container.innerHTML = ""; // limpa tudo
  let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

  let subtotal = 0;

  carrinho.forEach((item, index) => {
    const totalItem = (item.preco * item.quantidade);
    subtotal += totalItem;

    const itemDiv = document.createElement("div");
    itemDiv.classList.add("cart-item");

    itemDiv.innerHTML = `
      <div class="product">
        <img src="${item.imagem}" alt="${item.nome}" />
        <div class="item-detail">
          <p>${item.nome.split(":")[0]}<br><span class="sub">${item.nome.split(":")[1] || ""}</span></p>
        </div>
      </div>
      <div class="price">R$${item.preco.toFixed(2)}</div>
      <div class="quantity">
        <button class="qty-btn decrease" data-index="${index}">-</button>
        <span class="qty-display">${item.quantidade}</span>
        <button class="qty-btn increase" data-index="${index}">+</button>
      </div>
      <div class="total-price">R$${totalItem.toFixed(2)}</div>
      <div><button class="remove" data-index="${index}">X</button></div>
    `;

    container.appendChild(itemDiv);
  });

  subtotalElement.textContent = `R$${subtotal.toFixed(2)}`;
  freteElement.textContent = `R$${freteFixo.toFixed(2)}`;
  totalGeralElement.textContent = `R$${(subtotal + freteFixo).toFixed(2)}`;

  // depois de carregar, adiciona os botoes funcionais
  adicionarEventosBotoes();
}

//atualizar quantidade sem recarregar a página
function alterarQtd(index, delta) {
  let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
  carrinho[index].quantidade += delta;
  if (carrinho[index].quantidade < 1) carrinho[index].quantidade = 1;
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
  renderCarrinho();
}


function removerItem(index) {
  let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
  carrinho.splice(index, 1);
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
  renderCarrinho();
}


function adicionarEventosBotoes() {
  const btnsIncrease = container.querySelectorAll(".qty-btn.increase");
  const btnsDecrease = container.querySelectorAll(".qty-btn.decrease");
  const btnsRemove = container.querySelectorAll(".remove");

  btnsIncrease.forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault();
      const index = +btn.getAttribute("data-index");
      alterarQtd(index, 1);
    });
  });

  btnsDecrease.forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault();
      const index = +btn.getAttribute("data-index");
      alterarQtd(index, -1);
    });
  });

  btnsRemove.forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault();
      const index = +btn.getAttribute("data-index");
      removerItem(index);
    });
  });
}


let alertaTimeout;
function mostrarAlerta(mensagem) {
  const alerta = document.getElementById("meu-alerta");
  if (!alerta) return;

  alerta.textContent = mensagem;
  alerta.classList.add("mostrar");

  clearTimeout(alertaTimeout);
  alertaTimeout = setTimeout(() => {
    alerta.classList.remove("mostrar");
  }, 3000);
}

function adicionarAoCarrinho() {
  const produto = {
    id: 1,
    nome: "Quem é você, Alasca?: Edição comemorativa de 10 anos",
    preco: 34.99,
    quantidade: 1,
    imagem: "iih.jpg",
  };

  let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
  const itemExistente = carrinho.find(item => item.id === produto.id);
  if (itemExistente) {
    itemExistente.quantidade += 1;
  } else {
    carrinho.push(produto);
  }
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
  mostrarAlerta("Livro adicionado ao carrinho!");
  renderCarrinho();
}


document.addEventListener("DOMContentLoaded", () => {
  renderCarrinho();
});

