const imageInputEl = document.querySelector("#image-upload-control input");
const imagePreviewEl = document.querySelector("#image-upload-control img");

function updateImagePreview() {
  const files = imageInputEl.files;

  if (!files || files.length === 0) {
    imagePreviewEl.stlye.display = "none";
    return;
  }
  
  const imageFile = files[0];

  imagePreviewEl.src = URL.createObjectURL(imageFile); // 이미지 파일에 대한 URL 생성
  imagePreviewEl.style.display = "block";
}

imageInputEl.addEventListener("change", updateImagePreview);