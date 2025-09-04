import CartDao from '../dao/mongo/cart.dao.js';

export default class CartRepository {
  constructor() {
    this.dao = new CartDao();
  }

  create() {
    return this.dao.create();
  }

  findById(id) {
    return this.dao.findById(id);
  }

  updateById(id, data) {
    return this.dao.updateById(id, data);
  }

  async updateQuantity(cid, pid, qty) {
  const updatedCart = await this.dao.updateProductQuantity(cid, pid, qty);
  if (!updatedCart) return { error: 'No se pudo actualizar la cantidad' };
  return updatedCart;
}

async clear(cid) {
  const clearedCart = await this.dao.clearCart(cid);
  if (!clearedCart) return { error: 'No se pudo vaciar el carrito' };
  return clearedCart;
}

  save(cart) {
    return this.dao.save(cart);
  }


}
