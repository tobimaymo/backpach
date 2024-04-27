// Importar express y el router
const express = require('express');
const router = express.Router();
const { generateUniqueId } = require('../config/utils');
const Product = require('../models/product')


// Middleware para manejar el cuerpo de la solicitud (body parser)
router.use(express.json());

let products = [];

router.get('/create', (req, res) => {
    res.render('product', { products: products });
});

router.get('/', (req, res) => {
    Product.find().lean() // Aplicando el método lean() para obtener objetos JavaScript simples en lugar de instancias de mongoose
        .then(products => {
            res.render('products', { products: products }); // Renderiza la vista 'products' con los productos obtenidos
        })
        .catch(err => {
            console.error('Error al buscar los productos:', err);
            res.status(500).json({ message: 'Error interno del servidor al buscar los productos' });
        });
});

// Ruta GET /api/products/:code
router.get('/:code', (req, res) => {
    const { code } = req.params;
    Product.findOne({ code })
        .then(product => {
            if (!product) {
                return res.status(404).json({ message: 'Producto no encontrado' });
            }
            res.json(product);
        })
        .catch(err => {
            console.error('Error al buscar el producto:', err);
            res.status(500).json({ message: 'Error interno del servidor al buscar el producto' });
        });
});

// Ruta POST /api/products/
router.post('/', (req, res) => {
    const { title, description, code, price, stock, category } = req.body;
    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }
    const newProduct = new Product({
        title,
        description,
        code,
        price,
        stock,
        category,
        status: true
    });
    newProduct.save()
        .then(product => {
            res.status(201).json(product);
        })
        .catch(err => {
            console.error('Error al guardar el producto:', err);
            res.status(500).json({ message: 'Error interno del servidor al guardar el producto' });
        });
});

// Ruta PUT /api/products/:pid
router.put('/:pid', (req, res) => {
    const { pid } = req.params;
    Product.findByIdAndUpdate(pid, req.body, { new: true })
        .then(updatedProduct => {
            if (!updatedProduct) {
                return res.status(404).json({ message: 'Producto no encontrado' });
            }
            res.json(updatedProduct);
        })
        .catch(err => {
            console.error('Error al actualizar el producto:', err);
            res.status(500).json({ message: 'Error interno del servidor al actualizar el producto' });
        });
});

// Ruta DELETE /api/products/:pid
router.delete('/:pid', (req, res) => {
    const { pid } = req.params;
    Product.findByIdAndDelete(pid)
        .then(deletedProduct => {
            if (!deletedProduct) {
                return res.status(404).json({ message: 'Producto no encontrado' });
            }
            res.json(deletedProduct);
        })
        .catch(err => {
            console.error('Error al eliminar el producto:', err);
            res.status(500).json({ message: 'Error interno del servidor al eliminar el producto' });
        });
});


module.exports = router;
