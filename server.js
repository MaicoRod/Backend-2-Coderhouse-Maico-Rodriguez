import express from 'express';
import productsRouter from './routes/productsRouter.js';
import cartsRouter from './routes/cartsRouter.js';

const app = express();
app.use(express.json());

//Rutas de productos y carritos
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

//Servidor
app.listen(8080, () => console.log("Servidor corriendo en el puerto 8080"));

