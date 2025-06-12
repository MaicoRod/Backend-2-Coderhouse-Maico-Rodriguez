import ProductModel from '../models/ProductModel.js';

class ProductService {
    // Obtener productos con paginación, filtros y ordenamiento
    async getProducts({ limit = 10, page = 1, query, sort }) {
        try {
            // 🔍 Procesar el filtro desde query (ej: category:Celulares)
            const filter = {};

            if (query) {
                if (query.includes(':')) {
                    const [field, value] = query.split(':');
                    // Si el campo es "stock" y el valor es booleano
                    if (field === 'stock') {
                        filter[field] = value === 'true' ? { $gt: 0 } : 0;
                    } else {
                        filter[field] = value;
                    }
                } else if (query === 'available') {
                    filter.stock = { $gt: 0 };
                }
            }

            // ⚙️ Configurar ordenamiento por precio
            const sortOption = sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {};

            // 🧭 Opciones de paginación
            const options = {
                limit: parseInt(limit),
                page: parseInt(page),
                sort: sortOption,
                lean: true
            };

            // 📦 Ejecutar consulta
            const result = await ProductModel.paginate(filter, options);

            // ❗ Si no hay productos, retornar mensaje de aviso
            if (!result.docs.length) {
                return { error: 'No se encontraron productos con los criterios seleccionados.' };
            }

            return result;
        } catch (error) {
            console.error("Error al obtener productos:", error);
            return { error: "Error interno del servidor." };
        }
    }

    async getProductById(id) {
        try {
            if (!id) throw new Error("ID de producto inválido.");

            const product = await ProductModel.findById(id);
            return product || { error: "Producto no encontrado." };
        } catch (error) {
            console.error("Error al obtener producto:", error);
            return { error: "Error interno del servidor." };
        }
    }

    async addProduct(data) {
        try {
            if (!data.title || !data.price || !data.stock) {
                throw new Error("Faltan datos obligatorios para crear el producto.");
            }

            return await ProductModel.create(data);
        } catch (error) {
            console.error("Error al agregar producto:", error);
            return { error: "Error interno del servidor." };
        }
    }

    async updateProduct(id, data) {
        try {
            if (!id) throw new Error("ID de producto inválido.");

            const updatedProduct = await ProductModel.findByIdAndUpdate(id, data, { new: true });

            return updatedProduct || { error: "Producto no encontrado." };
        } catch (error) {
            console.error("Error al actualizar producto:", error);
            return { error: "Error interno del servidor." };
        }
    }

    async deleteProduct(id) {
        try {
            if (!id) throw new Error("ID de producto inválido.");

            const deletedProduct = await ProductModel.findByIdAndDelete(id);
            
            return deletedProduct ? { message: "Producto eliminado con éxito." } : { error: "Producto no encontrado." };
        } catch (error) {
            console.error("Error al eliminar producto:", error);
            return { error: "Error interno del servidor." };
        }
    }
}

export default ProductService;
