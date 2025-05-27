import express from 'express';
import { engine } from 'express-handlebars';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import path from 'path';
import productsRouter from './routes/productsRouter.js';
import cartsRouter from './routes/cartsRouter.js';
import ProductManager from './managers/ProductManager.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const productManager = new ProductManager('./data/products.json');


// Configuración de Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.io = io;
  next();
});


// Rutas de productos y carritos
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Renderizar la vista principal

app.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('home', { title: "Lista de Productos", products }); 
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).send("Error interno del servidor");
    }
});

app.get('/realTimeProducts', (req, res) => {
    res.render('realTimeProducts', { title: "Productos en Tiempo Real" });
});

// WebSockets
io.on('connection', async (socket) => {
    console.log('Cliente conectado');

    // Enviar la lista inicial de productos al cliente cuando se conecta
    const products = await productManager.getProducts();
    socket.emit('updateProducts', products);

    socket.on('newProduct', async (product) => {
        await productManager.addProduct(product);
        const updatedProducts = await productManager.getProducts();
        io.emit('updateProducts', updatedProducts);
    });

    socket.on('deleteProduct', async (productId) => {
        await productManager.deleteProduct(productId);
        const updatedProducts = await productManager.getProducts();
        io.emit('updateProducts', updatedProducts);
    });
});

httpServer.listen(8080, () => console.log("Servidor corriendo en el puerto 8080"));