import ProductService from '../services/productService.js';
const productService = new ProductService();

export const getProducts = async (req, res) => {
  try {
    const result = await productService.getProducts(req.query);
    res.status(200).json({
      status: 'success',
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? `/api/products?page=${result.prevPage}` : null,
      nextLink: result.hasNextPage ? `/api/products?page=${result.nextPage}` : null
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getProductById = async (req, res) => {
  const product = await productService.getProductById(req.params.pid);
  product
    ? res.json(product)
    : res.status(404).json({ error: 'Producto no encontrado' });
};

export const addProduct = async (req, res) => {
  const product = await productService.addProduct(req.body);
  const updated = await productService.getProducts({});
  req.io.emit('updateProducts', updated.docs || updated);
  res.status(201).json(product);
};

export const updateProduct = async (req, res) => {
  const updated = await productService.updateProduct(req.params.pid, req.body);
  updated
    ? res.json(updated)
    : res.status(404).json({ error: 'Producto no encontrado' });
};

export const deleteProduct = async (req, res) => {
  const deleted = await productService.deleteProduct(req.params.pid);
  const updated = await productService.getProducts({});
  req.io.emit('updateProducts', updated.docs || updated);
  deleted
    ? res.json({ message: 'Producto eliminado' })
    : res.status(404).json({ error: 'Producto no encontrado' });
};

