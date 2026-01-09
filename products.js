export class Products {
    constructor(name, price, category, stock, id) {
        // Validação básica
        if (!name || !category) {
            throw new Error("Nome e categoria são obrigatórios");
        }

        this.id = id ?? Date.now();
        this.name = String(name).trim();
        this.price = Number(price) || 0;
        this.category = String(category).trim();
        this.stock = Number(stock) || 0;
    }

    // Criar produto a partir de um objeto (útil ao carregar JSON)
    static from(obj) {
        return new Products(obj.name, obj.price, obj.category, obj.stock, obj.id);
    }

    // Converter para objeto simples (útil ao salvar em JSON)
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            price: this.price,
            category: this.category,
            stock: this.stock
        };
    }
}