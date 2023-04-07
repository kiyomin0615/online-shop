const formEls = document.querySelectorAll(".cart-item-management");
const cartTotalPriceEl = document.getElementById("cart-total-price");
const cartBadgeEl = document.querySelector(".nav-list .badge");

async function updateCartItem(event) {
  event.preventDefault();

  const formEl = event.target;
  const productId = formEl.dataset.productId;
  const csrfToken = formEl.dataset.csrfToken;
  const quantity = formEl.children[0].value;

  let response;
  try {
    response = await fetch("/cart/items", {
      method: "PATCH",
      body: JSON.stringify({
        productId: productId,
        quantity: quantity,
        _csrf: csrfToken
      }),
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    alert("요청에 실패했습니다.");
    return;
  }

  if (!response.ok) {
    alert("요청에 실패했습니다.");
    return;
  }

  const responseData = await response.json();

  if (responseData.updatedItemPrice === 0) {
    formEl.parentElement.parentElement.remove();
  } else {
    const cartItemTotalPriceEl = formEl.parentElement.querySelector(".cart-item-price");
    cartItemTotalPriceEl.textContent = responseData.updatedItemPrice;
  }
  
  cartTotalPriceEl.textContent = responseData.newTotalPrice;
  cartBadgeEl.textContent = responseData.newTotalQuantity;
}

for (let formEl of formEls) {
  formEl.addEventListener("submit", updateCartItem);
}