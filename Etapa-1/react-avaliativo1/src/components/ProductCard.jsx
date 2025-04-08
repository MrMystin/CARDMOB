import React from "react";

const ProductCard = ({product}) => {
  return (
    <>
      {product.name},
      {product.price}
      <button>Add to the cart</button>
    </>
  )
}

export default ProductCard;