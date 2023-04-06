const deleteProductBtnEls = document.querySelectorAll(".product-item button");

async function deleteProduct(event) {
  const deleteProductBtnEl = event.target;
  const productId = deleteProductBtnEl.dataset.productId;
  const csrfToken = deleteProductBtnEl.dataset.csrfToken;

  // fetch(path, configuration)
  const res = await fetch(`/admin/product/${productId}/?_csrf=${csrfToken}`, {
    method: "DELETE", // DELETE Request
  });

  if (!res.ok) {
    alert("요청에 실패했습니다.");
    return;
  }

  deleteProductBtnEl.parentElement.parentElement.parentElement.parentElement.remove(); // li 요소 제거
}

for (let deleteProductBtnEl of deleteProductBtnEls) {
  deleteProductBtnEl.addEventListener("click", deleteProduct);
}