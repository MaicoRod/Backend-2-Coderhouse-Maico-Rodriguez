import CartModel from '../models/CartModel.js';
import ProductModel from '../models/ProductModel.js';

class CartService {
  async createCart() {
    try {
      return await CartModel.create({ products: [] });
    } catch (error) {
      console.error('Error al crear el carrito:', error);
      return { error: 'Error al crear el carrito.' };
    }
  }

  async getCartById(id) {
    try {
      const cart = await CartModel.findById(id).populate('products.product');
      return cart || { error: 'Carrito no encontrado.' };
    } catch (error) {
      console.error('Error al obtener el carrito:', error);
      return { error: 'Error interno del servidor.' };
    }
  }

async getAnyCart() {
    try {
        let cart = await CartModel.findOne({});
        return cart; 
    } catch (error) {
        console.error("Error al obtener un carrito:", error);
        return null;
    }
}

  async addProductToCart(cid, pid) {
  try {
    const cart = await CartModel.findById(cid);
    if (!cart) return { error: 'Carrito no encontrado.' };

    const product = await ProductModel.findById(pid);
    if (!product) return { error: 'Producto no encontrado.' };

    // ⚠️ Verificar stock
    if (product.stock <= 0) {
      return { error: 'No hay stock disponible para este producto.' };
    }

    const existing = cart.products.find(p => p.product.toString() === pid);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }

    // 🔻 Descontar 1 unidad de stock
    product.stock -= 1;

    await product.save();
    const updatedCart = await cart.save();

    return { success: true, cart: updatedCart };
  } catch (error) {
    console.error('Error al agregar producto al carrito:', error);
    return { error: 'Error interno del servidor.' };
  }
}

  async deleteProductFromCart(cid, pid) {
  try {
    const cart = await CartModel.findById(cid);
    if (!cart) return { error: 'Carrito no encontrado.' };

    const item = cart.products.find(p => p.product.toString() === pid);
    if (!item) return { error: 'Producto no encontrado en el carrito.' };

    const product = await ProductModel.findById(pid);
    if (product) {
      // 🔼 Restaurar la cantidad al stock
      product.stock += item.quantity;
      await product.save();
    }

    // ❌ Eliminar el producto del carrito
    cart.products = cart.products.filter(p => p.product.toString() !== pid);
    const updatedCart = await cart.save();

    return { success: true, cart: updatedCart };
  } catch (error) {
    console.error('Error al eliminar producto del carrito:', error);
    return { error: 'Error interno del servidor.' };
  }
}

  async updateCartProducts(cid, newProducts) {
    try {
      const cart = await CartModel.findByIdAndUpdate(
        cid,
        { products: newProducts },
        { new: true }
      );
      return cart || { error: 'Carrito no encontrado.' };
    } catch (error) {
      console.error('Error al actualizar productos del carrito:', error);
      return { error: 'Error interno del servidor.' };
    }
  }

  async updateProductQuantity(cid, pid, qty) {
    try {
      if (!Number.isInteger(qty) || qty < 1) {
        return { error: 'La cantidad debe ser un número mayor a 0.' };
      }

      const cart = await CartModel.findById(cid);
      if (!cart) return { error: 'Carrito no encontrado.' };

      const product = cart.products.find(p => p.product.toString() === pid);
      if (!product) return { error: 'Producto no encontrado en el carrito.' };

      product.quantity = qty;
      const updatedCart = await cart.save();
      return { success: true, cart: updatedCart };
    } catch (error) {
      console.error('Error al actualizar la cantidad del producto:', error);
      return { error: 'Error interno del servidor.' };
    }
  }

  async deleteAllProductsFromCart(cid) {
    try {
      const cart = await CartModel.findByIdAndUpdate(
        cid,
        { products: [] },
        { new: true }
      );
      return cart || { error: 'Carrito no encontrado.' };
    } catch (error) {
      console.error('Error al vaciar el carrito:', error);
      return { error: 'Error interno del servidor.' };
    }
  }
}

export default CartService;