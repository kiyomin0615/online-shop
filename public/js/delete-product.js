const deleteProductBtnEls = document.querySelectorAll(".product-item button");

async function deleteProduct(event) {
  const deleteProductBtnEl = event.target;
  // 설마 data-attribute 대문자 불가능?!
  const productId = deleteProductBtnEl.dataset.pid;
  const csrfToken = deleteProductBtnEl.dataset.token;

  console.log(productId);
  console.log(csrfToken);

  // fetch(path, configuration)
  const response = await fetch(`/admin/products/${productId}?_csrf=${csrfToken}`, {
    method: "DELETE", // DELETE Request
  });

  if (!response.ok) {
    alert("요청에 실패했습니다.");
    return;
  }

  deleteProductBtnEl.parentElement.parentElement.parentElement.parentElement.remove(); // li 요소 제거
}

for (let deleteProductBtnEl of deleteProductBtnEls) {
  deleteProductBtnEl.addEventListener("click", deleteProduct);
}