import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { Products } from "./products.js";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);

export const __dirname = path.resolve();
export const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/agilstore", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(3000, () => {
    console.log("Server running on 3000");
});

const DATA_PATH = path.join(__dirname, "data", "products.json");

function loadProducts() {
    if (!fs.existsSync(DATA_PATH)) {
        fs.writeFileSync(DATA_PATH, JSON.stringify([]));
    }

    try {
        const raw = JSON.parse(fs.readFileSync(DATA_PATH));
        return raw.map(obj => Products.from(obj));
    } catch (err) {
        console.error('Failed to load products, resetting file', err);
        fs.writeFileSync(DATA_PATH, JSON.stringify([]));
        return [];
    }
}

function saveProducts(products) {
    const toSave = products.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        category: p.category,
        stock: p.stock
    }));
    fs.writeFileSync(DATA_PATH, JSON.stringify(toSave, null, 2));
}

let products = loadProducts();

// Return products with optional filtering, sorting and pagination
app.get("/products", (req, res) => {
    const { q, category, minPrice, maxPrice, sort, page = '1', limit = '10' } = req.query;

    let results = products.slice();

    // Search by name or category
    if (q) {
        const ql = q.toString().toLowerCase();
        results = results.filter(p =>
            (p.name || "").toString().toLowerCase().includes(ql) ||
            (p.category || "").toString().toLowerCase().includes(ql)
        );
    }

    // Filter by exact category
    if (category) {
        const cl = category.toString().toLowerCase();
        results = results.filter(p => (p.category || "").toString().toLowerCase() === cl);
    }

    // Price range
    const min = parseFloat(minPrice);
    if (!isNaN(min)) {
        results = results.filter(p => Number(p.price) >= min);
    }
    const max = parseFloat(maxPrice);
    if (!isNaN(max)) {
        results = results.filter(p => Number(p.price) <= max);
    }

    // Sorting: e.g., sort=price or sort=-price for descending
    if (sort) {
        const dir = sort.startsWith("-") ? -1 : 1;
        const field = sort.replace(/^-/, "");
        results.sort((a, b) => {
            const A = a[field];
            const B = b[field];
            if (A === undefined || B === undefined) return 0;
            if (A < B) return -1 * dir;
            if (A > B) return 1 * dir;
            return 0;
        });
    }

    // Pagination
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.max(1, parseInt(limit) || 10);
    const total = results.length;
    const totalPages = Math.max(1, Math.ceil(total / limitNum));
    const start = (pageNum - 1) * limitNum;
    const data = results.slice(start, start + limitNum);

    res.json({ data, meta: { total, page: pageNum, limit: limitNum, totalPages } });
});

app.get("/search", (req, res) => {
    const { query } = req.query;
    if (!query) return res.status(400).send("query parameter is required");

    const ql = query.toString().toLowerCase();

    const results = products.filter(p =>
        (p.name || "").toString().toLowerCase().includes(ql) ||
        p.id == query
    );

    if (results.length === 0) {
        return res.send("Nenhum produto encontrado");
    }

    res.json(results);
});

// Update product (accepts form or JSON). Returns JSON when client expects JSON, otherwise redirects back.
app.post("/update-product", (req, res) => {
    const { id, name, category, price, stock } = req.body;

    const product = products.find(p => p.id == id);
    if (!product) {
        if (req.headers.accept && req.headers.accept.indexOf('application/json') !== -1) {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }
        return res.status(404).send('Produto não encontrado');
    }

    if (name) product.name = name;
    if (category) product.category = category;
    if (price) product.price = Number(price);
    if (stock) product.stock = Number(stock);

    saveProducts(products);

    if (req.headers.accept && req.headers.accept.indexOf('application/json') !== -1) {
        return res.json({ success: true, product });
    }

    res.redirect('/');
});

// Delete product (accepts form or JSON). Returns JSON when client expects JSON.
app.post("/delete-product", (req, res) => {
    const { id } = req.body;

    const index = products.findIndex(p => p.id == id);
    if (index === -1) {
        if (req.headers.accept && req.headers.accept.indexOf('application/json') !== -1) {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }
        return res.status(404).send('Produto não encontrado');
    }

    products.splice(index, 1);
    saveProducts(products);

    if (req.headers.accept && req.headers.accept.indexOf('application/json') !== -1) {
        return res.json({ success: true });
    }

    res.redirect('/');
});

app.post("/add-product", (req, res) => {
    const { productName, productPrice, productCategory, productStock } = req.body;

    // Basic server-side validation to prevent malformed products
    if (!productName || !productCategory || !productPrice || !productStock) {
        console.warn('/add-product missing fields', req.body);
        return res.status(400).send('All fields are required');
    }

    const newProduct = new Products(
        productName,
        productPrice,
        productCategory,
        productStock
    );

    products.push(newProduct);
    saveProducts(products);
    console.log('Product added', newProduct);
    res.redirect('/');
});