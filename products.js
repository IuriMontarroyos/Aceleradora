export class Products {
    constructor(name, price, category, stock, id) {
        // If id is provided (when loading from file), keep it; otherwise create a new id
        this.id = id ?? Date.now();
        this.name = name;
        this.price = Number(price);
        this.category = category;
        this.stock = Number(stock);
    }

    // Helper to create from a plain object (useful when loading JSON)
    static from(obj) {
        return new Products(obj.name, obj.price, obj.category, obj.stock, obj.id);
    }
}