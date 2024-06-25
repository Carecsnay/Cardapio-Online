const modal = document.querySelector("#modal");
const menu = document.querySelector("#menu");
const cartBTN = document.querySelector("#cart-btn");
const cartItemsContainer = document.querySelector("#cart-items");
const cartTotal = document.querySelector("#cart-total");
const checkoutBTN = document.querySelector("#checkout");
const closeModalBTN = document.querySelector("#close-modal-btn");
const cardCounter = document.querySelector("#cart-count");
const addressInput = document.querySelector("#address");
const nameInput = document.querySelector("#name");
const warnNameInput = document.querySelector("#name-warn");
const warnAddressInput = document.querySelector("#address-warn");
const dateSpan = document.querySelector("#date-span");

let cart = [];

cartBTN.addEventListener("click", () => {
  modal.style.display = "flex";
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

closeModalBTN.addEventListener("click", () => {
  modal.style.display = "none";
});

function formatToBRL(amount) {
  return amount.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
}

menu.addEventListener("click", (e) => {
  let parentButton = e.target.closest(".add-to-cart-btn");

  if (parentButton) {
    const name = parentButton.getAttribute("data-name");
    const price = parseFloat(parentButton.getAttribute("data-price")).toFixed(
      2,
    );

    addToCart(name, price);
  }
});

function addToCart(name, price) {
  const existingItem = cart.find((item) => item.name === name);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({
      name,
      price,
      quantity: 1,
    });
  }

  updateModal();
}
function updateModal() {
  cartItemsContainer.innerHTML = "";
  let total = 0;
  let counterTotal = 0;

  cart.forEach((item) => {
    const totalPerItem = item.price * item.quantity;

    const cartItemElement = document.createElement("div");
    cartItemElement.classList.add(
      "flex",
      "justify-between",
      "mb-4",
      "flex-col",
    );

    cartItemElement.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-bold">${item.name}</p>
                    <p>Quantidade: ${item.quantity}</p>
                    <p class="font-medium mt-2">Valor: R$ ${item.price} x ${item.quantity} = R$ ${totalPerItem.toFixed(2)}</p>
                </div>
                <button class="item-modal-remove" data-name="${item.name}">
                    Remover
                </button>
            </div>
        `;

    total += totalPerItem;
    counterTotal += item.quantity;

    cartItemsContainer.appendChild(cartItemElement);
  });
  cardCounter.innerHTML = counterTotal;
  cartTotal.textContent = total.formatToBRL(total);
}

cartItemsContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("item-modal-remove")) {
    const name = e.target.getAttribute("data-name");
    removeItemCart(name);
  }
});

function removeItemCart(name) {
  const index = cart.findIndex((item) => item.name === name);

  if (index !== -1) {
    const item = cart[index];

    if (item.quantity > 1) {
      item.quantity -= 1;
      updateModal();
      return;
    } else {
      cart.splice(index, 1);
      updateModal();
    }
  }
}
nameInput.addEventListener("input", (e) => {
  let inputValue = e.target.value;

  if (inputValue !== "") {
    nameInput.classList.remove("border-red-500");
    warnNameInput.classList.add("hidden");
  } else {
    nameInput.classList.add("border-red-500");
    nameInput.classList.remove("hidden");
  }
});

addressInput.addEventListener("input", (e) => {
  let inputValue = e.target.value;

  if (inputValue !== "") {
    addressInput.classList.remove("border-red-500");
    warnAddressInput.classList.add("hidden");
  }
});

checkoutBTN.addEventListener("click", () => {
  const isOpen = checkRestaurantOpen();
  if (!isOpen) {
    customAlert(
      "⚠️ Comunicado ⚠️",
      "Estamos fechados no momento, voltamos em breve!",
    );
    return;
  }
  if (cart.length === 0) {
    Toastify({
      text: "⚠️ Seu carrinho está vazio. Por favor, adicione itens ao seu carrinho antes de finalizar o pedido.",
      style: {
        background: "#ef4444",
        "max-width": "90%",
      },
      stopOnFocus: true,
      position: "right",
      newWindow: true,
      close: true,
      gravity: "top",
      duration: 3000,
    }).showToast();
    return;
  }
  if (nameInput.value === "") {
    warnNameInput.classList.remove("hidden");
    nameInput.classList.add("border-red-500");
    return;
  }

  if (addressInput.value === "") {
    warnAddressInput.classList.remove("hidden");
    addressInput.classList.add("border-red-500");
    return;
  }

  const total = cart.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);

  const formattedTotal = formatToBRL(total);

  const messageWhatsapp = cart
    .map((item) => {
      return `${item.quantity}x ${item.name} *${formatToBRL(item.price * item.quantity)}*`;
    })
    .join("\n");

  const name = nameInput.value;
  const address = addressInput.value;
  const finalMessage = `*Novo pedido de ${name}*\n----------------------------------------\n${messageWhatsapp}\n----------------------------------------\n*Total:* ${formattedTotal}\n----------------------------------------\n\n*Endereço*\n${address}`;
  const phone = "+5586981270024";
  const encodedMessage = encodeURIComponent(finalMessage);

  window.open(`https://wa.me/${phone}?text=${encodedMessage}`, "_blank");
});

function customAlert(title, message) {
  let customAlertBox = document.createElement("div");
  customAlertBox.className =
    "fixed inset-0 flex items-center justify-center customAlertBox z-20";

  let customAlertOverlay = document.createElement("div");
  customAlertOverlay.className = "fixed inset-0 bg-gray-900 opacity-50 z-20";
  customAlertOverlay.addEventListener("click", function () {
    document.body.removeChild(customAlertBox);
  });

  let customAlertContent = document.createElement("div");
  customAlertContent.className =
    "bg-white rounded-lg px-4 py-9 max-w-[90%] sm:max-w-md absolute z-20";

  let horarioFuncionamento = document.createElement("p");
  horarioFuncionamento.className =
    "flex items-center justify-center text-red-600 text-sm mb-2 font-bold";
  horarioFuncionamento.innerHTML =
    "Horário de Funcionamento: Seg a Dom 18:00 às 22:00";

  let customAlertTitle = document.createElement("h2");
  customAlertTitle.className =
    "flex items-center justify-center text-lg font-semibold mb-2";
  customAlertTitle.innerHTML = title;

  let customAlertMessage = document.createElement("p");
  customAlertMessage.className =
    "flex items-center justify-center text-gray-700 mb-2";
  customAlertMessage.innerHTML = message;

  let okButton = document.createElement("button");
  okButton.className =
    "bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex items-center justify-center mx-auto"; // Adicionando classes para centralizar o botão
  let timer = 5;
  okButton.innerHTML = "OK (" + timer + "s)";

  let timerInterval = setInterval(function () {
    timer--;
    okButton.innerHTML = "OK (" + timer + "s)";
    if (timer === 0) {
      clearInterval(timerInterval);
      document.body.removeChild(customAlertBox);
    }
  }, 1000);

  okButton.onclick = function () {
    clearInterval(timerInterval);
    document.body.removeChild(customAlertBox);
  };

  customAlertContent.appendChild(customAlertTitle);
  customAlertContent.appendChild(customAlertMessage);
  customAlertContent.appendChild(horarioFuncionamento); // Adicionando o horário de funcionamento antes do título
  customAlertContent.appendChild(okButton);

  customAlertBox.appendChild(customAlertOverlay);
  customAlertBox.appendChild(customAlertContent);

  document.body.appendChild(customAlertBox);
}

function checkRestaurantOpen() {
  const data = new Date();
  const hora = data.getHours();
  return hora >= 18 && hora < 22; //true opened
}

isOpen = checkRestaurantOpen();

if (isOpen) {
  dateSpan.classList.remove("bg-red-500");
  dateSpan.classList.add("bg-green-600");
} else {
  dateSpan.classList.remove("bg-green-600");
  dateSpan.classList.add("bg-red-500");
}

//1:12:21 / 1:34:02
