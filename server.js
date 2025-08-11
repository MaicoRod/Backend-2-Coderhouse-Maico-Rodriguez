import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import passport from 'passport'; //Backend 2
import { initPassport } from './config/passport.config.js'; //Backend 2
import { engine } from 'express-handlebars';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import productsRouter from './routes/productsRouter.js';
import cartsRouter from './routes/cartsRouter.js';
import viewsRouter from './routes/viewsRouter.js';
import usersRouter from './routes/usersRouter.js'; // Backend 2
import sessionsRouter from './routes/sessionsRouter.js'; // Backend 2
import ProductService from './services/ProductService.js';
import './helpers/handlebars.js';


// Configuracion del servidor
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
const productService = new ProductService();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Handlebars
app.engine('handlebars', engine({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Inyectar Socket.io en req
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

// WebSockets
io.on('connection', async (socket) => {
    console.log('Cliente conectado');
    const result = await productService.getProducts({});
    socket.emit('updateProducts', result?.docs ?? result ?? []);

    socket.on('newProduct', async (product) => {
        await productService.addProduct(product);
        const updated = await productService.getProducts({});
        io.emit('updateProducts', updated?.docs ?? updated ?? []);
    });

    socket.on('deleteProduct', async (id) => {
        await productService.deleteProduct(id);
        const updated = await productService.getProducts({});
        io.emit('updateProducts', updated?.docs ?? updated ?? []);
    });
});

// MongoDB
const PORT = process.env.PORT || 8080;
const MONGO_URL = process.env.MONGO_URL;
mongoose.connect(MONGO_URL)
  .then(() => {
    console.log('Conectado a MongoDB');
    httpServer.listen(PORT, () =>
      console.log(`Servidor corriendo en http://localhost:${PORT}`)
    );
  })
  .catch(err => console.error('Error al conectar con MongoDB:', err));

  //Proyecto Backend 2

initPassport(); //Backend 2

  app.use(passport.initialize());

  app.use('/api/users', usersRouter);
  app.use('/api/sessions', sessionsRouter);


