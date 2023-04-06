const Product = require("../models/product.model");

async function getProducts(req, res, next) {
  // 비동기 에러 처리
  try {
    const products = await Product.findAll();
    res.render("admin/products/all-products", {products: products});
  } catch (error) {
    next(error);
    return;
  }
}

function getNewProduct(req, res, next) {
  res.render("admin/products/new-product");
}

async function createNewProduct(req, res) {
  const product = new Product({
    ...req.body,
    image: req.file.filename,
  });

  // 비동기 에러 처리
  try {
    await product.save();
  } catch (error) {
    next(error);
    return;
  }
  
  res.redirect("/admin/products");
}

async function getUpdateProduct(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    res.render("/admin/products/update-product", {product: product});
  } catch (error) {
    next(error);
  }
}

async function updateProduct(req, res, next) {
  const product = new Product({
    ...req.body,
    _id: req.params.id,
  });

  if (req.file) {
    product.replaceImage(req.file.filename);
  }

  try {
    await product.save();
  } catch (error) {
    next(error);
    return;
  }

  res.redirect("/admin/products");
}

async function deleteProduct(req, res, next) {
  let product;

  try {
    product = await Product.findById(req.params.id);
    await product.remove();
  } catch (error) {
    next(error);
    return;
  }

  res.json({message: "상품 삭제 완료!"});
}

module.exports = {
  getProducts: getProducts,
  getNewProduct: getNewProduct,
  createNewProduct: createNewProduct,
  getUpdateProduct: getUpdateProduct,
  updateProduct: updateProduct,
  deleteProduct: deleteProduct
}