const addToCartBtnEl = document.querySelector("#product-details button");
const badgeEl = document.querySelector(".nav-list .badge");

async function addToCart() {
  let response;
  try {
    response = await fetch("/cart/items", {
      method: "POST",
      body: JSON.stringify({
        productId: addToCartBtnEl.dataset.pid,
        _csrf: addToCartBtnEl.dataset.token
      }),
      headers: {
        "Content-Type": "application/json" // JSON 데이터 전송
      }
    });
  } catch (error) {
    alert("요청에 실패했습니다.");
  }

  if (!response.ok) {
    alert("요청에 실패했습니다.");
  }

  alert("장바구니에 상품이 추가됐습니다.");

  const responseData = await response.json(); // json to javascript object
  badgeEl.textContent = responseData.totalQuantity;
}

addToCartBtnEl.addEventListener("click", addToCart)