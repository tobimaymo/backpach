const CartManager = require('../src/dao/CartManager');
const ProductManager = require('../src/dao/ProductManager');
const TicketService = require('../src/services/TicketService');

const getCartDetails = async (req, res) => {
    const cartId = req.params.cid;
    const cart = await CartManager.getCartById(cartId);
    res.render('cartDetails', { cart });
};

const createCart = async (req, res) => {
    const cartId = await CartManager.createCart();
    io.emit('updateCarts', await CartManager.getCarts());
    res.json({ cartId });
};

const purchaseCart = async (req, res) => {
    const cartId = req.params.cid;
    const cart = await CartManager.getCartById(cartId);
    const products = cart.products;
    const productsNotPurchased = [];

    for (const product of products) {
        const productInfo = await ProductManager.getProductById(product.productId);

        if (productInfo.stock >= product.quantity) {
            await ProductManager.updateProductStock(product.productId, productInfo.stock - product.quantity);
            await TicketService.generateTicket(cartId, product.productId, product.quantity);
        } else {
            productsNotPurchased.push(product.productId);
        }
    }

    const remainingProducts = products.filter(product => !productsNotPurchased.includes(product.productId));
    await CartManager.updateCartProducts(cartId, remainingProducts);

    if (productsNotPurchased.length > 0) {
        res.status(400).json({ productsNotPurchased });
    } else {
        res.json({ message: 'Cart purchased successfully' });
    }
};

module.exports = {
    getCartDetails,
    createCart,
    purchaseCart,
};
