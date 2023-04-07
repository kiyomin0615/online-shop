const addToCartBtnEl = document.querySelector("#product-details button");

async function addToCart() {
  let response;
  try {
    response = await fetch("/cart/items", {
      method: "POST",
      body: JSON.stringify({
        productId: addToCartBtnEl.dataset.productId,
        _csrf: addToCartBtnEl.dataset.csrfToken
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

  const responseData = response.json(); // json data to javascript object
}

addToCartBtnEl.addEventListener("click", addToCart)