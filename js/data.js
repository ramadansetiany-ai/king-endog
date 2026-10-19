/**
 * ENDOGHAYAM - Master Data & LocalStorage Database
 * Menyimpan data produk telur, batch hasil panen, dan riwayat transaksi kasir
 */

const StoreData = {
    STORAGE_KEY_PRODUCTS: "endoghayam_products",
    STORAGE_KEY_BATCHES: "endoghayam_harvest_batches",
    STORAGE_KEY_TRANSACTIONS: "endoghayam_transactions",

    defaultProducts: [
        {
            id: "EGG-001",
            name: "Telur Ayam Negeri (Grade A Super)",
            category: "Ayam Negeri",
            price: 28500,
            unit: "kg",
            stock: 450,
            minStock: 50,
            image: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=600&auto=format&fit=crop&q=80",
            description: "Telur segar harian langsung dari kandang peternakan, cangkang tebal warna cokelat mulus, bebas antibiotik berbahaya.",
            grade: "Grade A",
            badge: "Paling Laris"
        },
        {
            id: "EGG-002",
            name: "Telur Ayam Kampung Asli Organik",
            category: "Ayam Kampung & Omega",
            price: 52000,
            unit: "tray (30 butir)",
            stock: 95,
            minStock: 20,
            image: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=600&auto=format&fit=crop&q=80",
            description: "Dihasilkan dari ayam kampung umbaran alami (free-range), kaya nutrisi, kuning telur oranye pekat alami.",
            grade: "Organik Premium",
            badge: "Favorit Sehat"
        },
        {
            id: "EGG-003",
            name: "Telur Ayam Omega-3 & DHA (Isi 10 Butir)",
            category: "Ayam Kampung & Omega",
            price: 38000,
            unit: "pack (10 butir)",
            stock: 120,
            minStock: 25,
            image: "https://images.unsplash.com/photo-1598965675045-45c5e72c7d05?w=600&auto=format&fit=crop&q=80",
            description: "Kaya asam lemak Omega-3 dan DHA tinggi untuk perkembangan otak dan kesehatan jantung. Pakan khusus biji rami & rumput laut.",
            grade: "Superfood",
            badge: "Nutrisi Tinggi"
        },
        {
            id: "EGG-004",
            name: "Telur Bebek Asin Masir Gurih",
            category: "Bebek",
            price: 4500,
            unit: "butir",
            stock: 260,
            minStock: 40,
            image: "https://images.unsplash.com/photo-1569288052389-dac9b01c9c05?w=600&auto=format&fit=crop&q=80",
            description: "Telur bebek pilihan diperam dengan abu gosok & garam bata merah alami. Kuning telur masir berminyak dan gurih lezat.",
            grade: "Grade Super",
            badge: "Siap Saji"
        },
        {
            id: "EGG-005",
            name: "Telur Bebek Mentah Segar",
            category: "Bebek",
            price: 3500,
            unit: "butir",
            stock: 180,
            minStock: 30,
            image: "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=600&auto=format&fit=crop&q=80",
            description: "Telur bebek segar untuk martabak telur, jamu tradisional, maupun olahan kuliner gurih berprotein tinggi.",
            grade: "Grade A",
            badge: "Segar"
        },
        {
            id: "EGG-006",
            name: "Telur Puyuh Pilihan Super",
            category: "Puyuh & Khusus",
            price: 42000,
            unit: "kg",
            stock: 75,
            minStock: 15,
            image: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=600&auto=format&fit=crop&q=80",
            description: "Telur puyuh segar bercorak alami, sangat cocok untuk hidangan sup, sate telur puyuh, dan catering keluarga.",
            grade: "Grade A",
            badge: "Segar Panen"
        },
        {
            id: "EGG-007",
            name: "Telur Ayam Arab Rendah Kolesterol",
            category: "Ayam Kampung & Omega",
            price: 3200,
            unit: "butir",
            stock: 140,
            minStock: 25,
            image: "https://images.unsplash.com/photo-1559825481-12a05cc00344?w=600&auto=format&fit=crop&q=80",
            description: "Mirip telur ayam kampung dengan cangkang putih krem bersih, rasio kuning telur lebih banyak dan rendah kolesterol.",
            grade: "Kualitas Premium",
            badge: "Rendah Lemak"
        },
        {
            id: "EGG-008",
            name: "Telur Sortir B (Catering & Bakery)",
            category: "Ayam Negeri",
            price: 22000,
            unit: "kg",
            stock: 60,
            minStock: 10,
            image: "https://images.unsplash.com/photo-1569288063643-5d29ad64df09?w=600&auto=format&fit=crop&q=80",
            description: "Telur ayam negeri dengan bentuk atau ukuran agak beragam, kualitas isi tetap segar & sangat hemat untuk usaha bakery atau kue.",
            grade: "Grade B",
            badge: "Ekonomis"
        }
    ],

    defaultBatches: [
        {
            id: "PANEN-20261019-01",
            date: "2026-10-19",
            coop: "Kandang A (Petelur Layer 1)",
            eggType: "Telur Ayam Negeri",
            goodQty: 240,
            unit: "kg",
            crackedQty: 4,
            notes: "Panen pagi hari cuaca cerah, kondisi cangkang sangat bagus dan tebal.",
            officer: "Budi Santoso"
        },
        {
            id: "PANEN-20261018-02",
            date: "2026-10-18",
            coop: "Kandang B (Kampung Free-Range)",
            eggType: "Telur Ayam Kampung Asli Organik",
            goodQty: 45,
            unit: "tray",
            crackedQty: 1,
            notes: "Pemberian pakan jagung giling + maggot segar teratur.",
            officer: "Siti Rahmawati"
        },
        {
            id: "PANEN-20261018-01",
            date: "2026-10-18",
            coop: "Kandang C (Puyuh Layer)",
            eggType: "Telur Puyuh Pilihan Super",
            goodQty: 35,
            unit: "kg",
            crackedQty: 2,
            notes: "Suhu kandang stabil 25°C, produksi optimal.",
            officer: "Ahmad Riyadi"
        }
    ],

    defaultTransactions: [
        {
            id: "TRX-20261019-001",
            date: "2026-10-19T10:15:00",
            customerName: "Ibu Hj. Aminah (Toko Berkah)",
            customerPhone: "081234567890",
            paymentMethod: "QRIS",
            items: [
                { id: "EGG-001", name: "Telur Ayam Negeri (Grade A Super)", price: 28500, qty: 15, subtotal: 427500 },
                { id: "EGG-002", name: "Telur Ayam Kampung Asli Organik", price: 52000, qty: 2, subtotal: 104000 }
            ],
            totalAmount: 531500,
            cashier: "Siti Rahmawati",
            status: "Selesai"
        },
        {
            id: "TRX-20261019-002",
            date: "2026-10-19T11:42:00",
            customerName: "Martabak Bangka 88",
            customerPhone: "087899887766",
            paymentMethod: "Tunai",
            items: [
                { id: "EGG-005", name: "Telur Bebek Mentah Segar", price: 3500, qty: 50, subtotal: 175000 },
                { id: "EGG-001", name: "Telur Ayam Negeri (Grade A Super)", price: 28500, qty: 5, subtotal: 142500 }
            ],
            totalAmount: 317500,
            cashier: "Budi Santoso",
            status: "Selesai"
        }
    ],

    getProducts() {
        const stored = localStorage.getItem(this.STORAGE_KEY_PRODUCTS);
        if (!stored) {
            this.saveProducts(this.defaultProducts);
            return this.defaultProducts;
        }
        try {
            return JSON.parse(stored);
        } catch {
            return this.defaultProducts;
        }
    },

    saveProducts(products) {
        localStorage.setItem(this.STORAGE_KEY_PRODUCTS, JSON.stringify(products));
    },

    getBatches() {
        const stored = localStorage.getItem(this.STORAGE_KEY_BATCHES);
        if (!stored) {
            this.saveBatches(this.defaultBatches);
            return this.defaultBatches;
        }
        try {
            return JSON.parse(stored);
        } catch {
            return this.defaultBatches;
        }
    },

    saveBatches(batches) {
        localStorage.setItem(this.STORAGE_KEY_BATCHES, JSON.stringify(batches));
    },

    getTransactions() {
        const stored = localStorage.getItem(this.STORAGE_KEY_TRANSACTIONS);
        if (!stored) {
            this.saveTransactions(this.defaultTransactions);
            return this.defaultTransactions;
        }
        try {
            return JSON.parse(stored);
        } catch {
            return this.defaultTransactions;
        }
    },

    saveTransactions(transactions) {
        localStorage.setItem(this.STORAGE_KEY_TRANSACTIONS, JSON.stringify(transactions));
    },

    // Reset ke data awal pabrik jika diinginkan
    resetToDefault() {
        this.saveProducts(this.defaultProducts);
        this.saveBatches(this.defaultBatches);
        this.saveTransactions(this.defaultTransactions);
    }
};

window.StoreData = StoreData;
