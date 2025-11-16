const menu = document.getElementById('menu');
const cartBtn = document.getElementById('cart-btn');
const cartModal = document.getElementById('cart-modal');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const checkOutBtn = document.getElementById('checkout-btn');
const closeModalBtn = document.getElementById('close-modal-btn');
const cartCounter = document.getElementById('cart-count');
const addressInput = document.getElementById('address');
const addressWarning = document.getElementById('address-warn');
const removeItemBtn = document.getElementById('remove-item');

let cart = [];

cartBtn.addEventListener('click', function(){
    updateModal();
    cartModal.style.display = 'flex';
})

cartModal.addEventListener('click', function(event){
    if(event.target === cartModal){
        cartModal.style.display = 'none';
    }
})

closeModalBtn.addEventListener('click', function(){
    cartModal.style.display = 'none';
})

menu.addEventListener('click', function(event){
    let parentButton = event.target.closest('.add-to-cart-btn')
    
    if(parentButton){
        const name = parentButton.getAttribute("data-name");
        const price = parseFloat(parentButton.getAttribute("data-price"));

        addToCart(name, price);
    }
})

function addToCart(name, price){
    const existingItem = cart.find(item => item.name === name)    

    if(existingItem){
        existingItem.quantity += 1;
        return;
    }

    cart.push({name, price, quantity : 1})

    updateModal()
}

function updateModal(){
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
                remover 
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

cartItemsContainer.addEventListener('click', function(event){
    if(event.target.classList.contains('remove-item')){
        const name = event.target.getAttribute('data-name')

        removeItemCart(name);
    }

});

function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name);
    
    if(index !== -1){
        const item = cart[index];
        console.log(item); 
    }
}
