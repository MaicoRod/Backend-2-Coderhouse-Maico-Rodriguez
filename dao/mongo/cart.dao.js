import CartModel from '../../models/CartModel.js';

export default class CartDao {
  async create() {
    return await CartModel.create({ products: [] });
  }

  async findById(id) {
    return await CartModel.findById(id).populate('products.product');
  }

  async updateById(id, data) {
    return await CartModel.findByIdAndUpdate(id, data, { new: true });
  }

  async save(cart) {
    return await cart.save();
  }

  async updateProductQuantity(cid, pid, qty) {
  const cart = await this.findById(cid);
  if (!cart) return null;

  const item = cart.products.find(p => p.product.toString() === pid);
  if (!item) return null;

  item.quantity = qty;
  return await cart.save();
}

async clearCart(cid) {
  const cart = await this.findById(cid);
  if (!cart) return null;

  cart.products = [];
  return await cart.save();
}

}
