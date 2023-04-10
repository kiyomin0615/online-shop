const updateOrderFormEls = document.querySelectorAll(
  '.order-actions form'
);

async function updateOrder(event) {
  event.preventDefault();
  const formEl = event.target;

  const formData = new FormData(formEl); // HTML Form 요소 데이터
  const status = formData.get('status');
  const orderId = formData.get('orderId');
  const csrfToken = formData.get('_csrf');

  let response;

  try {
    response = await fetch(`/admin/orders/${orderId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        status: status,
        _csrf: csrfToken,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    alert("주문 상태를 변경할 수 없습니다.");
    return;
  }

  if (!response.ok) {
    alert("주문 상태를 변경할 수 없습니다.");
    return;
  }

  const responseData = await response.json();

  form.parentElement.parentElement.querySelector('.badge').textContent =
    responseData.stats;
}

for (const updateOrderFormEl of updateOrderFormEls) {
  updateOrderFormEl.addEventListener('submit', updateOrder);
}