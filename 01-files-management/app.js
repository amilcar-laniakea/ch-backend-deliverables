const fs = require('fs/promises');

class ProductManager {
  constructor(path) {
    this.products = [];
    this.path = path
  }

  async #manageFile() {
    let data
    try {
      data = await fs.readFile(this.path, 'utf-8')
      return JSON.parse(data)
    } catch {
      data = []
      await fs.writeFile(this.path, JSON.stringify(data))
      return data
    }
  }

  async addProduct({title = '', description = '', price = 0, thumbnail = '', code, stock = 0}) {
    try{

    if (!code) return "Error: code is required";

    this.products =  await this.#manageFile();

    const product = {
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      id:
        this.products.reduce(
          (maxId, product) => Math.max(maxId, product.id),
          0
        ) + 1,
    };

    this.products.push(product); 
    await fs.writeFile(this.path, JSON.stringify(this.products))
    return `Product added successfully: `;
    } catch(error) {
      return `there is an error adding the product: ${error}`
    }
  }

  async deleteProduct(id) {
    try{
      this.products = await this.#manageFile();
      const index = this.products.findIndex((p) => p.id === id);
      if (index === -1) return "Product not found";

      this.products.splice(index, 1);
      await fs.writeFile(this.path, JSON.stringify(this.products));
      return "Product deleted successfully";
    }catch(error) {
      return `there is an error deleting the product: ${error}`
    }
  }
  
  async getProductById(id) {
    try{
    this.products = await this.#manageFile();
    const product = this.products.find(p => p.id === id);
    return product ? product : 'Product not found'; 
    } catch(error) {
      return `there is an error retrieving the product: ${error}`  
    }
  }

  async updateProduct(id, {title, description, price, thumbnail, code, stock}) {
    try{
    this.products = await this.#manageFile();
    const productIndex = this.products.findIndex((p) => p.id === id);
    if (productIndex === -1) return "Product not found";

    const product = this.products[productIndex];
    if (title !== undefined) product.title = title;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (thumbnail !== undefined) product.thumbnail = thumbnail;
    if (code !== undefined) product.code = code;
    if (stock !== undefined) product.stock = stock;

    await fs.writeFile(this.path, JSON.stringify(this.products))
    return 'Product updated successfully';
    }catch(error) {
      return `there is an error updating the product: ${error}`
    }
  }

  async getProducts() {
    try{
    this.products = await this.#manageFile();
    return this.products
    }catch(error) {
      return `there is an error retrieving the products: ${error}`
    }
  }
}

const productManager = new ProductManager('./products.txt');

async function displayProducts() {
  const initProducts = await productManager.getProducts();
  const addProduct = await productManager.addProduct({
    title: "Product 1",
    description: "Description 1",
    price: 100,
    thumbnail: "thumbnail 1",
    code: "code 1",
    stock: 10,
  });
  const getProducts = await productManager.getProducts();
  const getProductById = await productManager.getProductById(1);
  const getProductByWrongId = await productManager.getProductById(50);
  const getUpdatedProduct = await productManager.updateProduct(2, {
    title: "new update of product 2222222222",
  });
  const getProductsAferUpdate = await productManager.getProducts();
  const deleteProduct = await productManager.deleteProduct(5);
  const addProductAfterDelete = await productManager.addProduct({
    title: "Product test",
    description: "Description test",
    price: 100,
    thumbnail: "thumbnail test",
    code: "code 22",
    stock: 1,
  });
  const getProductsAfterDelete = await productManager.getProducts();

  console.log('get initial products:', initProducts);
  console.log('add product:', addProduct);
  console.log('get products after:', getProducts);
  console.log('get product by id:', getProductById);
  console.log("get product by wrong id:", getProductByWrongId);
  console.log('get updated product:', getUpdatedProduct);
  console.log("get products after update:", getProductsAferUpdate);
  console.log('delete product:', deleteProduct);
  console.log('add product after delete:', addProductAfterDelete);
  console.log('get products after delete:', getProductsAfterDelete);
}

displayProducts();