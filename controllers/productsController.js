import ProductService from '../services/ProductService.js';
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

/* 
import ProductService from '../services/productService.js';

const productService = new ProductService();

export const getProducts = async (req, res) => {
    try {
        const products = await productService.getProducts();
        res.status(200).json(products);
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const getProductById = async (req, res) => {
    try {
        const productId = Number(req.params.pid);
        if (isNaN(productId)) {
            return res.status(400).json({ error: "ID inválido, debe ser un número." });
        }

        const product = await productService.getProductById(productId);
        product ? res.json(product) : res.status(404).json({ error: "El producto no existe." });
    } catch (error) {
        console.error("Error al obtener producto:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const addProduct = async (req, res) => {
    try {
        const { title, price, code, category, stock } = req.body;
        if (!title || isNaN(price) || !code || !category || isNaN(stock)) {
            return res.status(400).json({ error: "Datos inválidos. Faltan campos requeridos." });
        }

        const newProduct = await productService.addProduct(req.body);

        if (newProduct.error) {
            return res.status(400).json(newProduct);
        }

        const updatedProducts = await productService.getProducts();
        req.io.emit('updateProducts', updatedProducts);

        res.status(201).json(newProduct);
    } catch (error) {
        console.error("Error al crear producto:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const productId = Number(req.params.pid);
        if (isNaN(productId)) {
            return res.status(400).json({ error: "ID inválido, debe ser un número." });
        }

        const deletedProduct = await productService.deleteProduct(productId);

        if (deletedProduct.error) {
            return res.status(404).json(deletedProduct);
        }

        const updatedProducts = await productService.getProducts();
        req.io.emit('updateProducts', updatedProducts);

        res.json(deletedProduct);
    } catch (error) {
        console.error("Error al eliminar producto:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};
 */