// Base class for all printed materials
abstract class LibraryItem  {
    constructor(
        public readonly id: string,
        protected title: string,
        protected author: string,
        protected year: number,
        protected available: boolean,
        protected type: 'book' | 'magazine' | 'brochure'
    ) {}

    abstract getInfo(): string;

    isAvailable(): boolean {
        return this.available;
    }
}

// Specific classes for different types of materials
class Book extends LibraryItem  {
    constructor(
        id: string,
        title: string,
        author: string,
        year: number,
        available: boolean,
        private isbn: string,
        private pages: number
    ) {
        super(id, title, author, year, available, 'book');
    }

    getInfo(): string {
        return `Book: ${this.title} by ${this.author} (${this.year}) - ISBN: ${this.isbn}, Pages: ${this.pages}`;
    }
}

class Magazine extends LibraryItem  {
    constructor(
        id: string,
        title: string,
        author: string,
        year: number,
        available: boolean,
        private issue: string,
    ) {
        super(id, title, author, year, available, 'magazine');
    }

    getInfo(): string {
        return `Magazine: ${this.title} by ${this.author} (${this.year}) - Issue: ${this.issue}`;
    }
}

class Brochure extends LibraryItem  {
    constructor(
        id: string,
        title: string,
        author: string,
        year: number,
        available: boolean,
        private topic: string,
    ) {
        super(id, title, author, year, available, 'brochure');
    }

    getInfo(): string {
        return `Brochure: ${this.title} by ${this.author} (${this.year}) - Topic: ${this.topic}`;
    }
}

class Library {
    private materials: LibraryItem [] = [];

    // Add new material
    addMaterial(material: LibraryItem): void {
        this.materials.push(material);
    }

    // Get all materials
    getAllMaterials(): LibraryItem [] {
        return this.materials;
    }

    // Filter materials
    filterMaterials(criteria: {
        author?: string,
        year?: number,
        type?: 'book' | 'magazine' | 'brochure'
    }): LibraryItem [] {
        return this.materials.filter(material => {
            return (!criteria.author || material.getInfo().includes(criteria.author)) &&
                   (!criteria.year || material.getInfo().includes(criteria.year.toString())) &&
                   (!criteria.type || material.getInfo().toLowerCase().startsWith(criteria.type));
        });
    }

    // Get material by ID
    getMaterialById(id: string): LibraryItem  | undefined {
        return this.materials.find(material => material.id === id);
    }

    // Remove material
    removeMaterial(id: string): boolean {
        const initialLength = this.materials.length;
        this.materials = this.materials.filter(material => material.id !== id);
        return initialLength !== this.materials.length;
    }

    // Update material
    updateMaterial(id: string, updatedMaterial: LibraryItem ): boolean {
        const index = this.materials.findIndex(material => material.id === id);
        if (index !== -1) {
            this.materials[index] = updatedMaterial;
            return true;
        }
        return false;
    }
}

// Example usage:
const library = new Library();

// Adding materials
const book = new Book("1", "TypeScript Guide", "John Doe", 2023, true, "ISBN123", 300);
const magazine = new Magazine("2", "Tech Weekly", "Jane Smith", 2023, true, "Issue 45");
const brochure = new Brochure("3", "Quick Start Guide", "Bob Johnson", 2023, true, "Programming");

library.addMaterial(book);
library.addMaterial(magazine);
library.addMaterial(brochure);

// Get all materials
console.log(library.getAllMaterials());

// Filter by author
console.log(library.filterMaterials({ author: "John Doe" }));

// Get by ID
console.log(library.getMaterialById("1"));

// Update material
const updatedBook = new Book("1", "Updated TypeScript Guide", "John Doe", 2023, true, "ISBN123", 350);
library.updateMaterial("1", updatedBook);

// Remove material
library.removeMaterial("2");
