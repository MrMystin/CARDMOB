import React, { useState } from "react";
import ProductSearch from './ProductSearch'
import ProductCard from './ProductCard'

const ProductList = ({nameList}) => {
    const [products, setProducts] = useState([]);
    const [newProductName, setNewProductName] = useState("");
    const [newProductPrice, setNewProductPrice] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editingName, setEditingName] = useState("");
    const [editingPrice, setEditingPrice] = useState("");

    // Callbacks do CRUD
    // Create
    const addProduct = () => {
        if (newProductName.trim() === "" || newProductPrice.trim() === "") return;
        setProducts([...products, {id: Date.now(), name: newProductName, price: newProductPrice}]);
        setNewProductName("");
        setNewProductPrice("");
    }

    //Read
    const startEdit = (id) => {
        setEditingId(id);
        let actualProduct = products.find((product) => product.id === Number(id) )
        setEditingName(actualProduct.name)
        setEditingPrice(actualProduct.price)
    }

    // Update
    const saveEdit = () => {
        setProducts(
            products.map((product) => 
                product.id === editingId ? {...product, name: editingName, price: editingPrice} : product
            )
        );
        setEditingId(null);
        setEditingName("")
        setEditingPrice("")
    }

    // Delete
    const deleteProduct = (id) => {
        setProducts(products.filter((product) => product.id !== id));
    }

    //cancel editing
    const cancelEdit = () => {
        setEditingId(null);
        setEditingName("")
        setEditingPrice("")
    }

    return (
        <div style={{ textAlign: "center", marginTop: "50px"}}>
            <h2>{nameList}</h2>
            <input 
                type="name" 
                value={newProductName}
                onChange={(event) => setNewProductName(event.target.value)}
                placeholder="Write the name of the product..."
            />
            <input 
                type="price" 
                value={newProductPrice}
                onChange={(event) => setNewProductPrice(event.target.value)}
                placeholder="Write the price of the product..."
            />
            <button onClick={addProduct}>CRUD Product</button>
            <ul style={{ listStyle: "none", padding: 0}}>
                {products.map((product) => (
                    <li key={product.id} style={{ margin: "10px 0"}}>
                        {editingId === product.id ? (
                            <>
                                <input 
                                    type="name" 
                                    value={editingName}
                                    onChange={(event) => setEditingName(event.target.value)}
                                />
                                <input 
                                    type="price" 
                                    value={editingPrice}
                                    onChange={(event) => setEditingPrice(event.target.value)}
                                />
                                <button onClick={saveEdit}>Save</button>
                                <a href="#" onClick={cancelEdit}>Cancel</a>
                            </>
                        ) : (
                            <>
                                <ProductCard product={product}/>
                                <button onClick={() => startEdit(product.id)}>Edit</button>
                                <button onClick={() => deleteProduct(product.id)}>Delete</button>
                            </>
                        ) }
                    </li>
                ))
                }
            </ul>
            <ProductSearch products={products} />
        </div>
    );
}

export default ProductList;