import express from "express";
import path from "path";
import fs from "fs";
import { Products } from "./products.js";

// Configuração básica
export const __dirname = path.resolve();
export const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Caminho do arquivo de dados
const DATA_PATH = path.join(__dirname, "data", "products.json");

// ============= Funções de arquivo =============

function loadProducts() {
    try {
        if (!fs.existsSync(DATA_PATH)) {
            fs.writeFileSync(DATA_PATH, JSON.stringify([]));
            return [];
        }
        const raw = JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));
        return raw.map(obj => Products.from(obj));
    } catch (err) {
        console.error("Erro ao carregar produtos:", err.message);
        fs.writeFileSync(DATA_PATH, JSON.stringify([]));
        return [];
    }
}

function saveProducts(products) {
    const data = products.map(p => p.toJSON());
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), "utf8");
}

let products = loadProducts();

// ============= Rotas =============

// Página principal
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Listar todos os produtos
app.get("/products", (req, res) => {
    res.json({ data: products });
});

// Buscar produtos por nome ou categoria
app.get("/search", (req, res) => {
    const query = req.query.q || "";
    if (!query.trim()) {
        return res.json({ data: [] });
    }

    const searchTerm = query.toLowerCase();
    const results = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm) ||
        p.category.toLowerCase().includes(searchTerm)
    );

    res.json({ data: results });
});

// Adicionar novo produto
app.post("/add-product", (req, res) => {
    const { productName, productPrice, productCategory, productStock } = req.body;

    // Validar campos obrigatórios
    if (!productName || !productCategory || !productPrice || !productStock) {
        return res.status(400).send("Todos os campos são obrigatórios");
    }

    // Criar novo produto
    const newProduct = new Products(
        productName,
        Number(productPrice),
        productCategory,
        Number(productStock)
    );

    products.push(newProduct);
    saveProducts(products);
    console.log("Produto adicionado:", newProduct.name);

    res.redirect("/");
});

// Atualizar produto
app.post("/update-product", (req, res) => {
    const { id, name, category, price, stock } = req.body;

    const product = products.find(p => p.id == id);
    if (!product) {
        return res.status(404).send("Produto não encontrado");
    }

    if (name) product.name = name;
    if (category) product.category = category;
    if (price) product.price = Number(price);
    if (stock) product.stock = Number(stock);

    saveProducts(products);
    console.log("Produto atualizado:", product.name);

    res.redirect("/");
});

// Deletar produto
app.post("/delete-product", (req, res) => {
    const { id } = req.body;

    const index = products.findIndex(p => p.id == id);
    if (index === -1) {
        return res.status(404).send("Produto não encontrado");
    }

    const productName = products[index].name;
    products.splice(index, 1);
    saveProducts(products);
    console.log("Produto deletado:", productName);

    res.redirect("/");
});

// Iniciar servidor
app.listen(3000, () => {
    console.log("🚀 Servidor rodando em http://localhost:3000");
});