
module.exports = {
    totalAmount: (cartDetails) => {
       let total = cartDetails.products.reduce((acc, curr) => {
            acc += (curr.productId.price - curr.productId.discount) * curr.quantity;
            return acc;
        }, 0);
        return total;
    }
}