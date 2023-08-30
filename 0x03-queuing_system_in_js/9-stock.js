import { createClient } from 'redis';
import { promisify } from 'util';

const express = require('express');

const app = express();
const PORT = 1245;
const client = createClient();
const getAsync = promisify(client.get).bind(client);

const listProducts = [
  {
    itemId: 1, itemName: 'Suitcase 250', price: 50, initialAvailableQuantity: 4,
  },
  {
    itemId: 2, itemName: 'Suitcase 450', price: 100, initialAvailableQuantity: 10,
  },
  {
    itemId: 3, itemName: 'Suitcase 650', price: 350, initialAvailableQuantity: 2,
  },
  {
    itemId: 4, itemName: 'Suitcase 1050', price: 550, initialAvailableQuantity: 5,
  },
];

const getItemById = (itemId) => {
  for (const product of listProducts) {
    if (product.itemId === itemId) {
      return product;
    }
  }
  return null;
};

const reserveStockById = (itemId, stock) => client.set(`item.${itemId}`, stock);
const getCurrentReservedStockById = async (itemId) => {
  try {
    const stock = await getAsync(itemId);
    return stock;
  } catch (err) {
    return 0;
  }
};

app.get('/list_products', (req, res) => {
  res.json(listProducts);
});

app.get('/list_products/:itemId', async (req, res) => {
  const { itemId } = req.params;
  const product = getItemById(parseInt(itemId, 10));
  if (!product) {
    res.status(404).json({ status: 'Product not found' });
    res.end();
    return;
  }
  const reserve = await getCurrentReservedStockById(parseInt(itemId, 10));
  product.currentQuantity = product.initialAvailableQuantity - reserve;
  res.json(product);
  res.end();
});

app.get('/reserve_product/:itemId', (req, res) => {
  const { itemId } = req.params;
  const prodId = parseInt(itemId, 10);
  const product = getItemById(prodId);
  if (!product) {
    res.status(404).json({ status: 'Product not found' });
    res.end();
    return;
  }
  if (!(product.initialAvailableQuantity)) {
    res.status(400).json({ status: 'Not enough stock available', itemId: prodId });
    res.end();
    return;
  }
  reserveStockById(prodId, 1);
  res.json({ status: 'Reservation confirmed', itemId: prodId });
  res.end();
});

app.listen(PORT, () => console.log(`The Server is running on port: ${PORT}`));
