const productBox = document.querySelector(".product__box");
let basketArray = [];
let data = [];

const productEl = ({ id, name, image, price, subtitle }) => {
  return `
         <div class="product">
      <div class="product__container">
        <a href="#" class="button__box">
          <span class="mask">
            <div class="button__container" data-product="${id}">
              <img src="img/Forma.svg" alt="корзина" class="product__basket" />
              <p class="product__button">Add to Cart</p>
            </div>
          </span>
          <img class="product__img" src="${image}" alt="${name}"/>
        </a>
      </div>
      <div class="product__content">
        <h2 class="product__title">${name}</h2>
        <p class="product__subtitle">${subtitle}</p>
        <p class="product__price"><span class="price">$${price}.00</span></p>
      </div>
    </div>`;
};

const basketEl = ({ id, name, image, price, color, size, quantity }) => {
  return `
                <div class="basket-product">
                 <button class="btn__del" data-product="${id}" type="button">удалить</button>
                 <div class="basket__content">
                   <img class="basket__img" src="${image}" alt="${name}" />
                   <div class="basket__desc">
                     <h2 class="basket__name">${name}</h2>
                     <p class="basket__price_label">
                       Price: <span class="basket__price">$${price}</span>
                     </p>
                     <p class="basket__color">Color:${color}</p>
                     <p class="basket__size">Size:${size}</p>
                     <div class="basket__qty">
                       <label class="imput__label">Quantity:</label>
                       <input class="input__quantity" type="text" value="${quantity}">
                     </div>
                   </div>
                 </div>
               </div>`;
};

(async () => {
  try {
    const responce = await fetch("data.json");

    if (!responce.ok) {
      throw new Error("Failed from data.json");
    }

    data = await responce.json();

    data.forEach((data) => {
      const productsEl = productEl(data);
      productBox.insertAdjacentHTML("beforeend", productsEl);
    });
  } catch (error) {
    console.error(error);
  }
}).apply();

productBox.addEventListener("click", (e) => {
  if (e.target.className === "button__container") {
    let haveProductBasket = false;
    basketArray.forEach((el) => {
      if (Number(el.id) === Number(e.target.dataset.product)) {
        el.quantity += 1;
        haveProductBasket = true;
      }
    });

    if (!haveProductBasket) {
      basketArray.push({ id: e.target.dataset.product, quantity: 1 });
    }

    let cartItems = document.querySelector(".cart__items");
    const basketTitleEl = document.querySelector(".basket__title");
    if (cartItems) {
      cartItems.remove();
      basketTitleEl.remove();
    }

    cartItems = document.createElement("div");
    cartItems.className = "cart__items";
    body = document.querySelector("body");
    body.insertAdjacentElement("beforeend", cartItems);
    let cartItemsData = data.filter((el) => {
      const find = basketArray.find((b) => {
        return el.id === Number(b.id);
      });
      if (find) {
        el.quantity = find.quantity;
        return el;
      } else {
        return false;
      }
    });

    const basketTitle = '<div class="basket__title">Card Items</div>';
    cartItems.insertAdjacentHTML("beforebegin", basketTitle);
    cartItemsData.forEach((data) => {
      const cardEls = basketEl(data);
      cartItems.insertAdjacentHTML("beforeend", cardEls);
    });
    
    const deleteButtons = document.querySelectorAll(".btn__del");
    deleteButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const product = button.closest(".basket-product");
        product.remove();
        const newCard = cartItemsData.filter((el) => {
          return Number(el.id) !== Number(e.target.dataset.product);
        });
        cartItemsData = newCard;
        if (cartItemsData.length < 1) {
          cartItems.remove();
          const basketTitleEl = document.querySelector(".basket__title");
          basketTitleEl.remove();
          basketArray = [];
        }
      });
    });
  }
});
