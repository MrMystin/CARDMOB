import React, { useState } from "react";

const ProductSearch = ({products}) => {
  const [productName, setProductName] = useState("");
  const [product, setProduct] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const search = () => {
    setHasSearched(true);
    if (productName.trim() === "") return;
    setProduct(products.find((product) => product.name === productName))
  }
  
  return (
    <>
      <h2>Search one product</h2>
      <input 
          type="name" 
          value={productName}
          onChange={(event) => setProductName(event.target.value)}
          placeholder="Write the name of the product..."
      />
       <button onClick={() => search()}>Search</button>
       {hasSearched && (
        product ? (
          <div>
            <h3>Product Found</h3>
            <p>Name: {product.name}</p>
            <p>Price: {product.price}</p>
          </div>
        ) : (
          <p>Product not found.</p>
        )
      )}
    </>
  );
}

export default ProductSearch;