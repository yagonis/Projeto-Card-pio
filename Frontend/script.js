const menu = document.getElementById('menu');
const cartBtn = document.getElementById('cart-btn');
const cartModal = document.getElementById('cart-modal');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const checkOutBtn = document.getElementById('checkout-btn');
const closeModalBtn = document.getElementById('close-modal-btn');
const cartCounter = document.getElementById('cart-count');
const addressInput = document.getElementById('address');
const addressWarn = document.getElementById('address-warn');
const removeItemBtn = document.getElementById('remove-item');
let cart = [];

cartBtn.addEventListener('click', function () {
    updateModal();
    cartModal.style.display = 'flex';
})

cartModal.addEventListener('click', function (event) {
    if (event.target === cartModal) {
        cartModal.style.display = 'none';
    }
})

closeModalBtn.addEventListener('click', function () {
    cartModal.style.display = 'none';
})

menu.addEventListener('click', function (event) {
    let parentButton = event.target.closest('.add-to-cart-btn')

    if (parentButton) {
        const name = parentButton.getAttribute("data-name");
        const price = parseFloat(parentButton.getAttribute("data-price"));

        addToCart(name, price);
    }
})

function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name)

    if (existingItem) {
        existingItem.quantity += 1;
        return;
    }

    cart.push({ name, price, quantity: 1 })

    updateModal()
}

function updateModal() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        cartItemElement.innerHTML = `
   <div class = "flex items-center justify-between">

        <div>
            <p class = "font-bold"> ${item.name} </p>
            <p> Qtd: ${item.quantity} </p>
            <p class ="font-medium mt-2"> ${item.price.toFixed(2)} </p>
        </div>

        <div>
            <button class = "remove-item" data-name = "${item.name}"> 
                Remover 
            </button>
        </div>
   </div>
    `
        total += item.price * item.quantity;

        cartItemsContainer.appendChild(cartItemElement);
    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    cartCounter.innerHTML = cart.length;

}

cartItemsContainer.addEventListener('click', function (event) {
    if (event.target.classList.contains('remove-item')) {
        const name = event.target.getAttribute('data-name')

        removeItemCart(name);
    }

});

function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name);

    if (index !== -1) {
        const item = cart[index];

        if (item.quantity > 1) {
            item.quantity -= 1; // Diminui o item caso ele tenha mais de um item no carrinho
            updateModal();
            return;
        }

        cart.splice(index, 1); // Splice remove o item do carrinho
        updateModal();

    }

}

addressInput.addEventListener('input', function (event) {
    let inputValue = event.target.value;

    if (inputValue !== "") {
        addressWarn.classList.add("hidden");
        addressInput.classList.remove("border-red-500");
    }
})

checkOutBtn.addEventListener('click', async function () {

    const isOpen = checkRestaurantOpen();

    if (!isOpen) {
        alert("O restaurante está fechado no momento. Nosso horário de funcionamento é das 18:00 às 23:00.");
        return;
    }

    if (cart.length === 0) return;
    if (addressInput.value === "") {
        addressWarn.classList.remove("hidden");
        addressInput.classList.add("border-red-500");
        return;
    }

    const pedidoData = {
        cart: cart,
        address: addressInput.value
    };

    try {
        const response = await fetch('http://localhost:3000/api/pedido', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pedidoData)
        });
        if (!response.ok) {
            throw new Error("Erro ao processar pedido.");
        }
        alert("Pedido realizado com sucesso! Obrigado por comprar conosco.");
        cart = []; //Limpa carrinho
        updateModal(); //Atualiza modal
        cartModal.style.display = 'none'; //Fecha Modal
    } catch (error) { //Lançamento de exceção
        console.log(error);
        alert("Algo deu errado. Tente novamente!");
    }


})

/*function checkRestaurantOpen() {
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora < 23;
}*/

const spanItem = document.getElementById('date-span');
const isOpen = checkRestaurantOpen();

if (isOpen) {
    spanItem.classList.remove('bg-red-500');
    spanItem.classList.add('bg-green-500');
} else {
    spanItem.classList.remove('bg-green-500');
    spanItem.classList.add('bg-red-500');
}
