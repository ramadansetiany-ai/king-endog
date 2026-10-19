/**
 * EGGPRO - Rekap Recording Harian Ayam Petelur Pro & Buku Kas Nota Penjualan
 * Logika perhitungan KPI Recording Peternakan Ayam Petelur & Buku Kas Kasir
 */

const EggApp = {
    STORAGE_SETTINGS: "eggpro_farm_settings",
    STORAGE_RECORDS: "eggpro_daily_records",
    STORAGE_TRANSACTIONS: "eggpro_cash_transactions",
    STORAGE_INVOICES: "eggpro_sales_invoices",
    STORAGE_VIEW: "eggpro_main_view",

    KATEGORI_PENGELUARAN: [
        'Pembelian Pakan',
        'Obat & Vaksin & Vitamin',
        'Operasional Listrik & Air',
        'Sekam & Sanitasi Kandang',
        'Gaji & Upah Tenaga Kerja',
        'Pembelian Egg Tray / Kardus',
        'Perawatan / Servis Peralatan',
        'Pengeluaran Lainnya',
    ],

    KATEGORI_PEMASUKAN: [
        'Penjualan Telur Kiloan',
        'Penjualan Telur Butir/Tray',
        'Penjualan Telur Bentes / Retak',
        'Penjualan Ayam Afkir',
        'Penjualan Pupuk / Kotoran Kandang',
        'Pemasukan Lainnya',
    ],

    defaultSettings: {
        farmName: "Peternakan Barokah Layer Farm",
        coopName: "Kandang A - Lohmann Brown",
        initialPop: 31,
        targetHd: 80.0,
        period: "REKAP BULANAN SEPTEMBER 2026",
        eggPrice: 25100, // Rp / kg
        feedPrice: 7400   // Rp / kg
    },

    // 12 Hari Data Contoh Recording
    defaultRecords: [
        { date: "2026-09-01", dead: 0, cull: 0, feed: 3.72, good: 23, cracked: 0, weight: 1.48, notes: "Kondisi ayam sehat" },
        { date: "2026-09-02", dead: 0, cull: 0, feed: 3.72, good: 24, cracked: 0, weight: 1.54, notes: "Nafsu makan baik" },
        { date: "2026-09-03", dead: 0, cull: 0, feed: 3.72, good: 22, cracked: 1, weight: 1.42, notes: "Pemberian vitamin anti-stres" },
        { date: "2026-09-04", dead: 0, cull: 0, feed: 3.72, good: 25, cracked: 0, weight: 1.61, notes: "Cuaca cerah" },
        { date: "2026-09-05", dead: 0, cull: 1, feed: 3.72, good: 23, cracked: 0, weight: 1.49, notes: "Afkir 1 ekor ayam terluka" },
        { date: "2026-09-06", dead: 0, cull: 0, feed: 3.72, good: 24, cracked: 0, weight: 1.55, notes: "Kandang dibersihkan" },
        { date: "2026-09-07", dead: 0, cull: 0, feed: 3.72, good: 22, cracked: 0, weight: 1.41, notes: "Air minum diganti" },
        { date: "2026-09-08", dead: 0, cull: 0, feed: 3.72, good: 24, cracked: 1, weight: 1.53, notes: "Telur retak di sarang" },
        { date: "2026-09-09", dead: 0, cull: 0, feed: 3.72, good: 23, cracked: 0, weight: 1.47, notes: "Kondisi stabil" },
        { date: "2026-09-10", dead: 0, cull: 0, feed: 3.72, good: 23, cracked: 0, weight: 1.49, notes: "Vaksinasi berkala" },
        { date: "2026-09-11", dead: 0, cull: 0, feed: 3.72, good: 22, cracked: 0, weight: 1.43, notes: "Pakan dihabiskan" },
        { date: "2026-09-12", dead: 0, cull: 0, feed: 3.72, good: 24, cracked: 0, weight: 1.53, notes: "Panen sore normal" }
    ],

    // Data Contoh Nota Penjualan
    defaultInvoices: [
        {
            id: "INV-20260912-001",
            buyerName: "Toko Sembako Berkah",
            buyerPhone: "081234567890",
            date: "2026-09-12",
            time: "16:30",
            items: [
                { name: "Telur Ayam Negeri Utuh", quantity: 17.95, unit: "kg", unitPrice: 25100, subtotal: 450545 }
            ],
            subtotal: 450545,
            discount: 0,
            finalAmount: 450545,
            paidAmount: 450545,
            paymentMethod: "Tunai",
            paymentStatus: "Lunas",
            notes: "Pelanggan langganan panen mingguan"
        },
        {
            id: "INV-20260910-002",
            buyerName: "Ibu Nurul Bakery",
            buyerPhone: "085712345678",
            date: "2026-09-10",
            time: "14:15",
            items: [
                { name: "Telur Ayam Butir / Tray", quantity: 3, unit: "tray", unitPrice: 52000, subtotal: 156000 }
            ],
            subtotal: 156000,
            discount: 0,
            finalAmount: 156000,
            paidAmount: 156000,
            paymentMethod: "QRIS",
            paymentStatus: "Lunas",
            notes: "Untuk pesanan kue bolu"
        },
        {
            id: "INV-20260908-003",
            buyerName: "Warung Bu Siti",
            buyerPhone: "088899990000",
            date: "2026-09-08",
            time: "11:20",
            items: [
                { name: "Telur Ayam Grade A", quantity: 10, unit: "kg", unitPrice: 25500, subtotal: 255000 }
            ],
            subtotal: 255000,
            discount: 5000,
            finalAmount: 250000,
            paidAmount: 100000,
            paymentMethod: "Tempo",
            paymentStatus: "Tempo",
            notes: "Sisa Rp 150.000 tempo 1 minggu"
        }
    ],

    // Data Contoh Transaksi Kas Masuk/Keluar
    defaultTransactions: [
        {
            id: "TRX-20260912-001",
            date: "2026-09-12",
            time: "16:30",
            type: "pemasukan",
            category: "Penjualan Telur Kiloan",
            description: "Penjualan telur panen 17.95 kg",
            amount: 450545,
            paymentMethod: "Tunai",
            customerName: "Toko Sembako Berkah",
            invoiceId: "INV-20260912-001"
        },
        {
            id: "TRX-20260911-002",
            date: "2026-09-11",
            time: "10:00",
            type: "pengeluaran",
            category: "Pembelian Pakan",
            description: "Konsentrat layer & jagung giling 50 kg",
            amount: 370000,
            paymentMethod: "Transfer Bank",
            customerName: "Poultry Shop Mitra Tani"
        },
        {
            id: "TRX-20260910-003",
            date: "2026-09-10",
            time: "14:15",
            type: "pemasukan",
            category: "Penjualan Telur Butir/Tray",
            description: "Penjualan 3 tray telur ayam",
            amount: 156000,
            paymentMethod: "QRIS",
            customerName: "Ibu Nurul Bakery",
            invoiceId: "INV-20260910-002"
        },
        {
            id: "TRX-20260908-004",
            date: "2026-09-08",
            time: "11:20",
            type: "pemasukan",
            category: "Penjualan Telur Kiloan",
            description: "DP Penjualan telur 10 kg (Tempo)",
            amount: 100000,
            paymentMethod: "Tempo",
            customerName: "Warung Bu Siti",
            invoiceId: "INV-20260908-003"
        },
        {
            id: "TRX-20260908-005",
            date: "2026-09-08",
            time: "09:20",
            type: "pengeluaran",
            category: "Obat & Vaksin & Vitamin",
            description: "Vitamin anti-stres Vita-Stress & Egg Stimulant",
            amount: 65000,
            paymentMethod: "Tunai",
            customerName: "Apotek Ternak Sehat"
        },
        {
            id: "TRX-20260907-006",
            date: "2026-09-07",
            time: "17:00",
            type: "pemasukan",
            category: "Penjualan Telur Bentes / Retak",
            description: "Telur retak segar 2 kg",
            amount: 38000,
            paymentMethod: "Tunai",
            customerName: "Martabak Barokah"
        },
        {
            id: "TRX-20260905-007",
            date: "2026-09-05",
            time: "15:30",
            type: "pemasukan",
            category: "Penjualan Ayam Afkir",
            description: "Penjualan 1 ekor ayam afkir sehat",
            amount: 45000,
            paymentMethod: "Tunai",
            customerName: "Pak Slamet (Pengepul)"
        },
        {
            id: "TRX-20260904-008",
            date: "2026-09-04",
            time: "11:00",
            type: "pengeluaran",
            category: "Pembelian Egg Tray / Kardus",
            description: "Beli 50 pcs egg tray karton tebal",
            amount: 50000,
            paymentMethod: "Tunai",
            customerName: "Toko Karton Indah"
        }
    ],

    // Cashbook & Invoices State
    activeMainView: 'cashbook',
    cashActiveTab: 'transaksi',
    cashFilterType: 'semua',
    cashSearchQuery: '',
    manualTransactionType: 'pengeluaran',
    invoiceItems: [],
    activeViewingInvoice: null,

    init() {
        this.loadSettings();
        if (!localStorage.getItem(this.STORAGE_RECORDS)) {
            this.loadSampleData(false);
        } else {
            // Pastikan data buku kas & nota ada
            if (!localStorage.getItem(this.STORAGE_TRANSACTIONS)) {
                this.saveCashTransactions(this.defaultTransactions);
            }
            if (!localStorage.getItem(this.STORAGE_INVOICES)) {
                this.saveInvoices(this.defaultInvoices);
            }
        }
        this.calculateAndRender();
        this.renderCashbook();
        this.setupCurrentDate();
        
        // Terapkan view utama (default: cashbook / buku kas & nota)
        const savedView = localStorage.getItem(this.STORAGE_VIEW) || 'cashbook';
        this.switchMainView(savedView);

        // Inisialisasi Sinkronisasi Real-time Cloud (Firebase Firestore)
        this.cloudSync.init();

        if (window.lucide) {
            lucide.createIcons();
        }
    },

    setupCurrentDate() {
        const today = new Date().toISOString().split('T')[0];
        const input = document.getElementById("input-rec-date");
        if (input) input.value = today;
    },

    // --- FORMATTER UTILS ---
    formatRupiah(amount) {
        const isNegative = amount < 0;
        const absVal = Math.abs(amount || 0);
        return `${isNegative ? '- ' : ''}Rp ${absVal.toLocaleString('id-ID')}`;
    },

    formatNumberId(val) {
        return (val || 0).toLocaleString('id-ID');
    },

    // --- LOCAL STORAGE GETTERS & SETTERS ---
    getSettings() {
        try {
            return JSON.parse(localStorage.getItem(this.STORAGE_SETTINGS)) || this.defaultSettings;
        } catch {
            return this.defaultSettings;
        }
    },

    saveSettings(settings) {
        localStorage.setItem(this.STORAGE_SETTINGS, JSON.stringify(settings));
        if (this.cloudSync) this.cloudSync.pushData();
    },

    getRecords() {
        try {
            return JSON.parse(localStorage.getItem(this.STORAGE_RECORDS)) || [];
        } catch {
            return [];
        }
    },

    saveRecords(records) {
        localStorage.setItem(this.STORAGE_RECORDS, JSON.stringify(records));
        this.calculateAndRender();
        if (this.cloudSync) this.cloudSync.pushData();
    },

    getCashTransactions() {
        try {
            return JSON.parse(localStorage.getItem(this.STORAGE_TRANSACTIONS)) || [];
        } catch {
            return [];
        }
    },

    saveCashTransactions(transactions) {
        localStorage.setItem(this.STORAGE_TRANSACTIONS, JSON.stringify(transactions));
        this.renderCashbook();
        if (this.cloudSync) this.cloudSync.pushData();
    },

    getInvoices() {
        try {
            return JSON.parse(localStorage.getItem(this.STORAGE_INVOICES)) || [];
        } catch {
            return [];
        }
    },

    saveInvoices(invoices) {
        localStorage.setItem(this.STORAGE_INVOICES, JSON.stringify(invoices));
        this.renderCashbook();
        if (this.cloudSync) this.cloudSync.pushData();
    },

    loadSampleData(showToastMsg = true) {
        this.saveSettings(this.defaultSettings);
        this.saveRecords(this.defaultRecords);
        this.saveCashTransactions(this.defaultTransactions);
        this.saveInvoices(this.defaultInvoices);
        this.calculateAndRender();
        this.renderCashbook();
        if (this.cloudSync) this.cloudSync.pushData();
        if (showToastMsg) {
            this.showToast("Data contoh Peternakan Barokah berhasil dimuat!", "success");
        }
    },

    resetData() {
        if (!confirm("Apakah Anda yakin ingin mereset seluruh data recording dan buku kas?")) return;
        localStorage.removeItem(this.STORAGE_RECORDS);
        localStorage.removeItem(this.STORAGE_TRANSACTIONS);
        localStorage.removeItem(this.STORAGE_INVOICES);
        this.saveRecords([]);
        this.saveCashTransactions([]);
        this.saveInvoices([]);
        this.calculateAndRender();
        this.renderCashbook();
        if (this.cloudSync) this.cloudSync.pushData();
        this.showToast("Data recording & kas berhasil direset.", "info");
    },

    // --- DESKTOP & TABLET VIEW SWITCHER ---
    switchMainView(viewName) {
        this.activeMainView = viewName;
        localStorage.setItem(this.STORAGE_VIEW, viewName);

        const recSec = document.getElementById("recordingSection");
        const cashSec = document.getElementById("cashbookSection");
        const btnCash = document.getElementById("view-tab-cashbook");
        const btnRec = document.getElementById("view-tab-recording");
        const btnAll = document.getElementById("view-tab-all");

        if (viewName === 'cashbook') {
            if (cashSec) cashSec.classList.remove("hidden");
            if (recSec) recSec.classList.add("hidden");
            if (btnCash) btnCash.className = "px-4 py-2 rounded-xl transition flex items-center gap-2 bg-amber-600 text-white shadow-xs font-bold";
            if (btnRec) btnRec.className = "px-4 py-2 rounded-xl transition flex items-center gap-2 text-slate-600 hover:text-amber-900 font-semibold";
            if (btnAll) btnAll.className = "px-3 py-2 rounded-xl transition text-slate-500 hover:text-slate-800 hidden md:flex items-center gap-1.5 font-medium";
        } else if (viewName === 'recording') {
            if (cashSec) cashSec.classList.add("hidden");
            if (recSec) recSec.classList.remove("hidden");
            if (btnRec) btnRec.className = "px-4 py-2 rounded-xl transition flex items-center gap-2 bg-amber-600 text-white shadow-xs font-bold";
            if (btnCash) btnCash.className = "px-4 py-2 rounded-xl transition flex items-center gap-2 text-slate-600 hover:text-amber-900 font-semibold";
            if (btnAll) btnAll.className = "px-3 py-2 rounded-xl transition text-slate-500 hover:text-slate-800 hidden md:flex items-center gap-1.5 font-medium";
        } else {
            // Tampilkan kedua section
            if (cashSec) cashSec.classList.remove("hidden");
            if (recSec) recSec.classList.remove("hidden");
            if (btnAll) btnAll.className = "px-3 py-2 rounded-xl transition bg-slate-800 text-white shadow-xs hidden md:flex items-center gap-1.5 font-bold";
            if (btnCash) btnCash.className = "px-4 py-2 rounded-xl transition flex items-center gap-2 text-slate-600 hover:text-amber-900 font-semibold";
            if (btnRec) btnRec.className = "px-4 py-2 rounded-xl transition flex items-center gap-2 text-slate-600 hover:text-amber-900 font-semibold";
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (window.lucide) {
            lucide.createIcons();
        }
    },

    closeAllModals() {
        document.getElementById("modal-manual-transaction")?.classList.add("hidden");
        document.getElementById("modal-create-invoice")?.classList.add("hidden");
        document.getElementById("modal-view-invoice")?.classList.add("hidden");
        document.getElementById("modal-farm-settings")?.classList.add("hidden");
        document.getElementById("modal-add-record")?.classList.add("hidden");
        document.getElementById("modal-qr")?.classList.add("hidden");
        document.getElementById("modal-cloud-sync")?.classList.add("hidden");
    },

    // ==============================================================
    // 1. RECORDING KALKULASI & RENDERING
    // ==============================================================
    calculateAndRender() {
        const settings = this.getSettings();
        const records = this.getRecords();

        // Update Header & Card Titles
        const cardPeriod = document.getElementById("card-period-badge");
        const cardSubtitle = document.getElementById("card-farm-subtitle");

        if (cardPeriod) cardPeriod.textContent = `${settings.period} • ${settings.period.replace('REKAP BULANAN ', '')}`;
        if (cardSubtitle) cardSubtitle.textContent = `${settings.farmName} • ${settings.coopName}`;

        let currentPop = settings.initialPop;
        let totalDead = 0;
        let totalCull = 0;
        let totalFeed = 0;
        let totalGood = 0;
        let totalCracked = 0;
        let totalWeight = 0;
        let popSum = 0;

        const tableBody = document.getElementById("daily-table-body");
        const countBadge = document.getElementById("records-count-badge");

        if (countBadge) countBadge.textContent = `${records.length} Hari Tercatat`;
        this.setText("badge-nav-rec-count", `${records.length}`);

        // Proses setiap baris harian
        const rowsHtml = records.map((rec, index) => {
            totalDead += rec.dead;
            totalCull += rec.cull;
            currentPop = currentPop - rec.dead - rec.cull;
            popSum += currentPop;

            totalFeed += rec.feed;
            totalGood += rec.good;
            totalCracked += rec.cracked;
            totalWeight += rec.weight;

            const totalEggsDay = rec.good + rec.cracked;
            const gramPerEkorDay = currentPop > 0 ? (rec.feed * 1000) / currentPop : 0;
            const hdDay = currentPop > 0 ? (totalEggsDay / currentPop) * 100 : 0;
            const fcrDay = rec.weight > 0 ? (rec.feed / rec.weight) : 0;

            return `
                <tr class="hover:bg-amber-50/40 transition">
                    <td class="px-4 py-3 font-semibold text-gray-900">${rec.date}</td>
                    <td class="px-4 py-3 text-rose-600 font-bold">${rec.dead}</td>
                    <td class="px-4 py-3 text-amber-700 font-bold">${rec.cull}</td>
                    <td class="px-4 py-3 font-extrabold text-gray-800">${currentPop}</td>
                    <td class="px-4 py-3 text-blue-700 font-bold">${rec.feed.toLocaleString('id-ID', { minimumFractionDigits: 2 })}</td>
                    <td class="px-4 py-3 text-gray-500">${gramPerEkorDay.toFixed(1)}</td>
                    <td class="px-4 py-3 text-gray-800 font-semibold">${rec.good}</td>
                    <td class="px-4 py-3 text-rose-600 font-semibold">${rec.cracked}</td>
                    <td class="px-4 py-3 text-amber-800 font-bold">${totalEggsDay}</td>
                    <td class="px-4 py-3 text-emerald-700 font-bold">${rec.weight.toLocaleString('id-ID', { minimumFractionDigits: 2 })}</td>
                    <td class="px-4 py-3 text-emerald-600 font-bold">${hdDay.toFixed(2)}%</td>
                    <td class="px-4 py-3 text-amber-700 font-semibold">${fcrDay.toFixed(2)}</td>
                    <td class="px-4 py-3 text-right">
                        <button onclick="EggApp.deleteDailyRecord(${index})" class="text-gray-300 hover:text-rose-600 p-1" title="Hapus">✕</button>
                    </td>
                </tr>
            `;
        }).join("");

        if (tableBody) {
            tableBody.innerHTML = rowsHtml || `<tr><td colspan="13" class="px-4 py-8 text-center text-gray-400">Belum ada catatan harian. Klik "Muat Data Contoh" atau "+ Catat Recording Hari Ini".</td></tr>`;
        }

        // Kalkulasi Agregat Laporan (Sticky Note)
        const daysCount = records.length || 1;
        const avgPop = records.length > 0 ? (popSum / records.length) : settings.initialPop;
        const totalEggs = totalGood + totalCracked;

        const finalPop = currentPop;
        const gramPerEkorAvg = (avgPop > 0 && daysCount > 0) ? (totalFeed * 1000) / (avgPop * daysCount) : 0;
        const avgEggsPerDay = totalEggs / daysCount;
        const avgHd = (avgPop > 0 && daysCount > 0) ? (totalEggs / (avgPop * daysCount)) * 100 : 0;
        const fcrRatio = totalWeight > 0 ? (totalFeed / totalWeight) : 0;
        const eggWeightAvg = totalEggs > 0 ? (totalWeight * 1000) / totalEggs : 0;

        const pendapatanTelur = totalWeight * settings.eggPrice;
        const biayaPakan = totalFeed * settings.feedPrice;
        const labaKotor = pendapatanTelur - biayaPakan;
        const hppPakanPerKg = totalWeight > 0 ? (biayaPakan / totalWeight) : 0;

        // Update Tampilan 6 Metric Cards
        this.setText("metric-populasi-akhir", `${finalPop} Ekor`);
        this.setText("metric-populasi-sub", `Mati: ${totalDead} • Afkir: ${totalCull}`);

        this.setText("metric-total-pakan", `${totalFeed.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Kg`);
        this.setText("metric-pakan-sub", `${gramPerEkorAvg.toLocaleString('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} gr/ekor`);

        this.setText("metric-total-telur", `${totalEggs} Butir`);
        this.setText("metric-telur-sub", `${totalGood} Utuh • ${totalCracked} Retak`);

        this.setText("metric-berat-telur", `${totalWeight.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Kg`);
        this.setText("metric-berat-sub", `Rata: ${avgEggsPerDay.toLocaleString('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} btr/hari`);

        this.setText("metric-rata-hd", `${avgHd.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`);
        this.setText("metric-hd-sub", `Target: ${settings.targetHd}%`);

        this.setText("metric-fcr-ratio", `${fcrRatio.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
        this.setText("metric-fcr-sub", `EW: ${eggWeightAvg.toLocaleString('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} gr/btr`);

        // Update Dark Bottom Bar
        this.setText("metric-laba-kotor", `Rp ${Math.round(labaKotor).toLocaleString('id-ID')}`);
        this.setText("metric-laba-sub", `Pendapatan (Rp ${Math.round(pendapatanTelur).toLocaleString('id-ID')}) - Biaya (Rp ${Math.round(biayaPakan).toLocaleString('id-ID')})`);
        this.setText("metric-hpp-pakan", `Rp ${Math.round(hppPakanPerKg).toLocaleString('id-ID')} /kg`);
    },

    setText(id, val) {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
    },

    // ==============================================================
    // 2. BUKU KAS & NOTA PENJUALAN (EGG CASHBOOK SECTION)
    // ==============================================================
    renderCashbook() {
        const transactions = this.getCashTransactions();
        const invoices = this.getInvoices();

        // 4 Financial Stats Calculation
        const totalPemasukan = transactions
            .filter((t) => t.type === 'pemasukan')
            .reduce((sum, t) => sum + t.amount, 0);

        const totalPengeluaran = transactions
            .filter((t) => t.type === 'pengeluaran')
            .reduce((sum, t) => sum + t.amount, 0);

        const saldoBersih = totalPemasukan - totalPengeluaran;

        const totalPiutang = invoices
            .filter((inv) => inv.paymentStatus === 'Tempo' || inv.finalAmount > inv.paidAmount)
            .reduce((sum, inv) => sum + (inv.finalAmount - inv.paidAmount), 0);

        // Update 4 Financial Stat Cards
        const saldoEl = document.getElementById("cash-stat-saldo");
        if (saldoEl) {
            saldoEl.textContent = this.formatRupiah(saldoBersih);
            saldoEl.className = `text-lg sm:text-2xl font-bold font-mono tabular-nums ${
                saldoBersih >= 0 ? 'text-slate-800' : 'text-rose-600'
            }`;
        }
        this.setText("cash-stat-pemasukan", this.formatRupiah(totalPemasukan));
        this.setText("cash-stat-pengeluaran", this.formatRupiah(totalPengeluaran));
        this.setText("cash-stat-piutang", this.formatRupiah(totalPiutang));

        // Update Tab Counts
        this.setText("cash-tab-count-trx", transactions.length);
        this.setText("cash-tab-count-inv", invoices.length);
        this.setText("badge-nav-cash-count", transactions.length);

        // Tab Visibility
        const tableWrapper = document.getElementById("cash-table-wrapper");
        const invoicesWrapper = document.getElementById("cash-invoices-wrapper");
        const subFilters = document.getElementById("cash-sub-filters");
        const btnTabTrx = document.getElementById("btn-tab-transaksi");
        const btnTabInv = document.getElementById("btn-tab-nota");
        const searchInput = document.getElementById("cash-search-input");

        if (this.cashActiveTab === 'transaksi') {
            if (tableWrapper) tableWrapper.classList.remove("hidden");
            if (invoicesWrapper) invoicesWrapper.classList.add("hidden");
            if (subFilters) subFilters.classList.remove("hidden");
            if (btnTabTrx) btnTabTrx.className = "px-3.5 py-1.5 rounded-lg transition bg-white shadow-xs text-amber-900 font-bold";
            if (btnTabInv) btnTabInv.className = "px-3.5 py-1.5 rounded-lg transition hover:text-amber-800 text-slate-600";
            if (searchInput) searchInput.placeholder = "Cari transaksi berdasarkan keterangan, kategori, atau nama pembeli...";

            // Filter transactions
            const filteredTransactions = transactions
                .filter((t) => {
                    if (this.cashFilterType === 'pemasukan') return t.type === 'pemasukan';
                    if (this.cashFilterType === 'pengeluaran') return t.type === 'pengeluaran';
                    if (this.cashFilterType === 'tempo') return t.paymentMethod === 'Tempo';
                    return true;
                })
                .filter((t) => {
                    const q = this.cashSearchQuery.toLowerCase();
                    return (
                        (t.description && t.description.toLowerCase().includes(q)) ||
                        (t.category && t.category.toLowerCase().includes(q)) ||
                        (t.customerName && t.customerName.toLowerCase().includes(q))
                    );
                })
                .sort((a, b) => (b.date || '').localeCompare(a.date || '') || (b.time || '').localeCompare(a.time || ''));

            // Render Tab 1 Table Body
            const tbody = document.getElementById("cash-table-body");
            if (tbody) {
                if (filteredTransactions.length === 0) {
                    tbody.innerHTML = `
                        <tr>
                            <td colspan="6" class="py-12 text-center text-slate-400 text-xs">
                                Tidak ada transaksi kas yang sesuai
                            </td>
                        </tr>
                    `;
                } else {
                    tbody.innerHTML = filteredTransactions.map((trx) => `
                        <tr class="hover:bg-slate-50/70 transition-colors">
                            <td class="py-2.5 px-3 font-mono tabular-nums text-slate-600 text-[11px] whitespace-nowrap">
                                ${trx.date} <span class="text-slate-400">${trx.time}</span>
                            </td>
                            <td class="py-2.5 px-2.5 whitespace-nowrap">
                                <span class="inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                                    trx.type === 'pemasukan' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                                }">
                                    ${trx.category}
                                </span>
                            </td>
                            <td class="py-2.5 px-3">
                                <div class="font-medium text-slate-800">${trx.description}</div>
                                ${trx.customerName ? `<div class="text-[10px] text-slate-400">Pihak: ${trx.customerName}</div>` : ''}
                            </td>
                            <td class="py-2.5 px-2 text-center whitespace-nowrap">
                                <span class="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-medium">
                                    ${trx.paymentMethod}
                                </span>
                            </td>
                            <td class="py-2.5 px-3 text-right font-mono tabular-nums font-bold text-xs whitespace-nowrap">
                                <span class="${trx.type === 'pemasukan' ? 'text-emerald-700' : 'text-rose-600'}">
                                    ${trx.type === 'pemasukan' ? '+' : '-'} ${this.formatRupiah(trx.amount)}
                                </span>
                            </td>
                            <td class="py-2.5 px-2 text-center">
                                <div class="flex items-center justify-center space-x-1">
                                    ${trx.invoiceId ? `
                                        <button
                                            onclick="EggApp.viewInvoiceById('${trx.invoiceId}')"
                                            class="text-amber-600 hover:text-amber-800 p-1 rounded"
                                            title="Lihat Nota Penjualan"
                                        >
                                            <i data-lucide="receipt" class="w-3.5 h-3.5"></i>
                                        </button>
                                    ` : ''}
                                    <button
                                        onclick="EggApp.deleteTransaction('${trx.id}')"
                                        class="text-slate-300 hover:text-rose-600 p-1 rounded"
                                        title="Hapus transaksi"
                                    >
                                        <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `).join("");
                }
            }
        } else {
            // TAB 2: NOTA PENJUALAN
            if (tableWrapper) tableWrapper.classList.add("hidden");
            if (invoicesWrapper) invoicesWrapper.classList.remove("hidden");
            if (subFilters) subFilters.classList.add("hidden");
            if (btnTabTrx) btnTabTrx.className = "px-3.5 py-1.5 rounded-lg transition hover:text-amber-800 text-slate-600";
            if (btnTabInv) btnTabInv.className = "px-3.5 py-1.5 rounded-lg transition bg-white shadow-xs text-amber-900 font-bold";
            if (searchInput) searchInput.placeholder = "Cari nota berdasarkan nama pembeli, nomor nota, atau HP...";

            const filteredInvoices = invoices
                .filter((inv) => {
                    const q = this.cashSearchQuery.toLowerCase();
                    return (
                        (inv.buyerName && inv.buyerName.toLowerCase().includes(q)) ||
                        (inv.id && inv.id.toLowerCase().includes(q)) ||
                        (inv.buyerPhone && inv.buyerPhone.includes(q))
                    );
                })
                .sort((a, b) => (b.date || '').localeCompare(a.date || '') || (b.time || '').localeCompare(a.time || ''));

            const grid = document.getElementById("cash-invoices-grid");
            if (grid) {
                if (filteredInvoices.length === 0) {
                    grid.innerHTML = `
                        <div class="col-span-1 md:col-span-2 lg:col-span-3 py-12 text-center text-slate-400 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200">
                            Belum ada nota penjualan dibuat. Klik tombol "+ Buat Nota Penjualan" untuk mulai membuat nota.
                        </div>
                    `;
                } else {
                    grid.innerHTML = filteredInvoices.map((inv) => `
                        <div class="bg-slate-50/70 border border-slate-200 hover:border-amber-300 rounded-xl p-4 space-y-3 transition-colors text-xs">
                            <div class="flex justify-between items-start border-b border-slate-200/70 pb-2.5">
                                <div>
                                    <span class="font-mono font-bold text-amber-900 text-xs">${inv.id}</span>
                                    <h4 class="font-bold text-slate-800 text-sm mt-0.5">${inv.buyerName}</h4>
                                    <p class="text-slate-500 text-[11px]">${inv.buyerPhone || '-'}</p>
                                </div>
                                <div class="text-right">
                                    <span class="inline-block px-2 py-0.5 rounded-full font-bold text-[10px] ${
                                        inv.paymentStatus === 'Lunas' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                                    }">
                                        ${inv.paymentStatus === 'Lunas' ? 'LUNAS' : 'TEMPO'}
                                    </span>
                                    <p class="text-[10px] text-slate-400 font-mono mt-1">
                                        ${inv.date} ${inv.time}
                                    </p>
                                </div>
                            </div>

                            <!-- Items summary -->
                            <div class="space-y-1 text-slate-600">
                                ${inv.items.map((it) => `
                                    <div class="flex justify-between text-[11px]">
                                        <span>${it.name} (${it.quantity} ${it.unit})</span>
                                        <span class="font-mono tabular-nums font-semibold">${this.formatRupiah(it.subtotal)}</span>
                                    </div>
                                `).join("")}
                            </div>

                            <!-- Total & Action -->
                            <div class="flex items-center justify-between pt-2 border-t border-slate-200/70">
                                <div>
                                    <span class="text-[10px] text-slate-400 uppercase font-semibold">Total Tagihan</span>
                                    <p class="text-sm font-bold font-mono tabular-nums text-emerald-700">
                                        ${this.formatRupiah(inv.finalAmount)}
                                    </p>
                                </div>

                                <div class="flex items-center space-x-1.5">
                                    <button
                                        onclick="EggApp.viewInvoiceById('${inv.id}')"
                                        class="bg-white hover:bg-amber-50 text-amber-800 border border-slate-200 hover:border-amber-300 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center space-x-1"
                                    >
                                        <i data-lucide="eye" class="w-3 h-3"></i>
                                        <span>Buka Nota</span>
                                    </button>
                                    <button
                                        onclick="EggApp.deleteInvoice('${inv.id}')"
                                        class="text-slate-300 hover:text-rose-600 p-1.5 rounded"
                                        title="Hapus Nota"
                                    >
                                        <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    `).join("");
                }
            }
        }

        // Sub filter buttons styling
        document.querySelectorAll(".cash-filter-btn").forEach((btn) => {
            const ft = btn.getAttribute("data-filter");
            if (ft === this.cashFilterType) {
                btn.className = "cash-filter-btn px-2.5 py-1 rounded-lg transition capitalize font-medium bg-slate-800 text-white font-bold";
            } else {
                btn.className = "cash-filter-btn px-2.5 py-1 rounded-lg transition capitalize font-medium bg-slate-100 text-slate-600 hover:bg-slate-200";
            }
        });

        if (window.lucide) {
            lucide.createIcons();
        }
    },

    switchCashTab(tab) {
        this.cashActiveTab = tab;
        this.renderCashbook();
    },

    setCashFilter(filter) {
        this.cashFilterType = filter;
        this.renderCashbook();
    },

    onSearchCash(val) {
        this.cashSearchQuery = val || "";
        this.renderCashbook();
    },

    // --- MANUAL TRANSACTION MODAL ---
    openManualTransactionModal(type = 'pengeluaran') {
        this.setManualTransactionType(type);
        const amountInput = document.getElementById("manual-trx-amount");
        const descInput = document.getElementById("manual-trx-desc");
        const customerInput = document.getElementById("manual-trx-customer");
        const methodSelect = document.getElementById("manual-trx-method");

        if (amountInput) amountInput.value = "";
        if (descInput) descInput.value = "";
        if (customerInput) customerInput.value = "";
        if (methodSelect) methodSelect.value = "Tunai";

        document.getElementById("modal-manual-transaction")?.classList.remove("hidden");
        if (window.lucide) lucide.createIcons();
    },

    closeManualTransactionModal() {
        document.getElementById("modal-manual-transaction")?.classList.add("hidden");
    },

    setManualTransactionType(type) {
        this.manualTransactionType = type;
        const btnPengeluaran = document.getElementById("btn-trx-type-pengeluaran");
        const btnPemasukan = document.getElementById("btn-trx-type-pemasukan");
        const modalTitle = document.getElementById("manual-trx-modal-title");
        const catSelect = document.getElementById("manual-trx-category");

        if (type === 'pengeluaran') {
            if (btnPengeluaran) btnPengeluaran.className = "py-2 rounded-lg transition bg-rose-600 text-white shadow-xs";
            if (btnPemasukan) btnPemasukan.className = "py-2 rounded-lg transition text-slate-600 hover:text-slate-900";
            if (modalTitle) modalTitle.textContent = "Catat Pengeluaran Kas";
            if (catSelect) {
                catSelect.innerHTML = this.KATEGORI_PENGELUARAN.map(c => `<option value="${c}">${c}</option>`).join("");
            }
        } else {
            if (btnPengeluaran) btnPengeluaran.className = "py-2 rounded-lg transition text-slate-600 hover:text-slate-900";
            if (btnPemasukan) btnPemasukan.className = "py-2 rounded-lg transition bg-emerald-600 text-white shadow-xs";
            if (modalTitle) modalTitle.textContent = "Catat Pemasukan Kas";
            if (catSelect) {
                catSelect.innerHTML = this.KATEGORI_PEMASUKAN.map(c => `<option value="${c}">${c}</option>`).join("");
            }
        }
    },

    handleManualTransactionSubmit(e) {
        e.preventDefault();
        const amount = parseInt(document.getElementById("manual-trx-amount")?.value, 10);
        if (!amount || isNaN(amount) || amount <= 0) {
            this.showToast("Masukkan nominal transaksi yang valid!", "warning");
            return;
        }

        const category = document.getElementById("manual-trx-category")?.value || "";
        const desc = document.getElementById("manual-trx-desc")?.value.trim() || category;
        const customer = document.getElementById("manual-trx-customer")?.value.trim() || undefined;
        const method = document.getElementById("manual-trx-method")?.value || "Tunai";

        const today = new Date().toISOString().split('T')[0];
        const timeNow = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':');
        const id = `TRX-${Date.now().toString().slice(-6)}`;

        const transactions = this.getCashTransactions();
        transactions.unshift({
            id: id,
            date: today,
            time: timeNow,
            type: this.manualTransactionType,
            category: category,
            description: desc,
            amount: amount,
            paymentMethod: method,
            customerName: customer
        });

        this.saveCashTransactions(transactions);
        this.closeManualTransactionModal();
        this.showToast("Transaksi kas berhasil dicatat!", "success");
    },

    deleteTransaction(id) {
        if (!confirm("Hapus transaksi kas ini?")) return;
        let transactions = this.getCashTransactions();
        transactions = transactions.filter(t => t.id !== id);
        this.saveCashTransactions(transactions);
        this.showToast("Transaksi dihapus.", "info");
    },

    // --- CREATE INVOICE MODAL ---
    openCreateInvoiceModal() {
        const settings = this.getSettings();
        const today = new Date().toISOString().split('T')[0];
        const timeNow = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':');

        const buyerName = document.getElementById("invoice-buyer-name");
        const buyerPhone = document.getElementById("invoice-buyer-phone");
        const invoiceDate = document.getElementById("invoice-date");
        const invoiceTime = document.getElementById("invoice-time");
        const discount = document.getElementById("invoice-discount");
        const notes = document.getElementById("invoice-notes");
        const method = document.getElementById("invoice-method");

        if (buyerName) buyerName.value = "";
        if (buyerPhone) buyerPhone.value = "";
        if (invoiceDate) invoiceDate.value = today;
        if (invoiceTime) invoiceTime.value = timeNow;
        if (discount) discount.value = "0";
        if (notes) notes.value = "";
        if (method) method.value = "Tunai";

        this.invoiceItems = [
            {
                name: "Telur Ayam Negeri Utuh",
                quantity: 1,
                unit: "kg",
                unitPrice: settings.eggPrice || 25100,
                subtotal: settings.eggPrice || 25100
            }
        ];

        this.renderInvoiceItemRows();
        this.recalculateInvoiceTotals();

        document.getElementById("modal-create-invoice")?.classList.remove("hidden");
        if (window.lucide) lucide.createIcons();
    },

    closeCreateInvoiceModal() {
        document.getElementById("modal-create-invoice")?.classList.add("hidden");
    },

    renderInvoiceItemRows() {
        const container = document.getElementById("invoice-items-container");
        if (!container) return;

        const standardProducts = [
            "Telur Ayam Negeri Utuh",
            "Telur Butir / Tray (30 btr)",
            "Telur Retak / Bentes",
            "Telur Ayam Kampung Organik",
            "Telur Bebek Mentah",
            "Telur Bebek Asin Masir",
            "Telur Puyuh Super",
            "Ayam Afkir",
            "Pupuk Kandang (Kotoran Kering)"
        ];

        container.innerHTML = this.invoiceItems.map((item, idx) => `
            <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-2.5 bg-white border border-slate-200 rounded-xl text-xs">
                <div class="flex-1">
                    <input
                        type="text"
                        list="invoice-product-suggestions"
                        value="${item.name}"
                        onchange="EggApp.updateInvoiceItem(${idx}, 'name', this.value)"
                        placeholder="Nama produk..."
                        class="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg font-medium focus:ring-1 focus:ring-amber-500"
                    />
                </div>
                <div class="flex items-center gap-1.5">
                    <input
                        type="number"
                        step="0.01"
                        min="0.1"
                        value="${item.quantity}"
                        oninput="EggApp.updateInvoiceItem(${idx}, 'quantity', parseFloat(this.value) || 0)"
                        placeholder="Qty"
                        class="w-16 px-2 py-1.5 border border-slate-200 rounded-lg text-center font-mono font-bold"
                    />
                    <select
                        onchange="EggApp.updateInvoiceItem(${idx}, 'unit', this.value)"
                        class="px-2 py-1.5 border border-slate-200 rounded-lg bg-white"
                    >
                        <option value="kg" ${item.unit === 'kg' ? 'selected' : ''}>kg</option>
                        <option value="tray" ${item.unit === 'tray' ? 'selected' : ''}>tray</option>
                        <option value="butir" ${item.unit === 'butir' ? 'selected' : ''}>butir</option>
                        <option value="pack" ${item.unit === 'pack' ? 'selected' : ''}>pack</option>
                        <option value="sak" ${item.unit === 'sak' ? 'selected' : ''}>sak</option>
                        <option value="ekor" ${item.unit === 'ekor' ? 'selected' : ''}>ekor</option>
                    </select>
                </div>
                <div class="flex items-center gap-1.5">
                    <div class="relative">
                        <span class="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">Rp</span>
                        <input
                            type="number"
                            min="0"
                            value="${item.unitPrice}"
                            oninput="EggApp.updateInvoiceItem(${idx}, 'unitPrice', parseInt(this.value, 10) || 0)"
                            placeholder="Harga"
                            class="w-24 pl-6 pr-2 py-1.5 border border-slate-200 rounded-lg font-mono font-semibold text-right"
                        />
                    </div>
                    <span class="w-24 text-right font-mono font-bold text-amber-900 tabular-nums">
                        ${this.formatRupiah(item.subtotal)}
                    </span>
                    <button
                        type="button"
                        onclick="EggApp.removeInvoiceItemRow(${idx})"
                        class="text-slate-300 hover:text-rose-600 p-1 rounded"
                        title="Hapus baris"
                    >
                        ✕
                    </button>
                </div>
            </div>
        `).join("");

        if (!document.getElementById("invoice-product-suggestions")) {
            const dl = document.createElement("datalist");
            dl.id = "invoice-product-suggestions";
            dl.innerHTML = standardProducts.map(p => `<option value="${p}">`).join("");
            document.body.appendChild(dl);
        }
    },

    addInvoiceItemRow() {
        const settings = this.getSettings();
        this.invoiceItems.push({
            name: "Telur Ayam Negeri Utuh",
            quantity: 1,
            unit: "kg",
            unitPrice: settings.eggPrice || 25100,
            subtotal: settings.eggPrice || 25100
        });
        this.renderInvoiceItemRows();
        this.recalculateInvoiceTotals();
    },

    removeInvoiceItemRow(idx) {
        if (this.invoiceItems.length <= 1) {
            this.showToast("Minimal harus ada 1 item barang pada nota!", "warning");
            return;
        }
        this.invoiceItems.splice(idx, 1);
        this.renderInvoiceItemRows();
        this.recalculateInvoiceTotals();
    },

    updateInvoiceItem(idx, field, value) {
        if (!this.invoiceItems[idx]) return;
        this.invoiceItems[idx][field] = value;
        if (field === 'quantity' || field === 'unitPrice') {
            this.invoiceItems[idx].subtotal = Math.round(
                (this.invoiceItems[idx].quantity || 0) * (this.invoiceItems[idx].unitPrice || 0)
            );
        }
        this.renderInvoiceItemRows();
        this.recalculateInvoiceTotals();
    },

    onInvoiceMethodChange(method) {
        const total = this.calculateInvoiceFinalTotal();
        const paidInput = document.getElementById("invoice-paid-amount");
        if (paidInput) {
            if (method === 'Tempo') {
                paidInput.value = "0";
            } else {
                paidInput.value = total;
            }
        }
        this.recalculateInvoiceTotals();
    },

    calculateInvoiceFinalTotal() {
        const subtotal = this.invoiceItems.reduce((sum, it) => sum + (it.subtotal || 0), 0);
        const discount = parseInt(document.getElementById("invoice-discount")?.value, 10) || 0;
        return Math.max(0, subtotal - discount);
    },

    recalculateInvoiceTotals() {
        const subtotal = this.invoiceItems.reduce((sum, it) => sum + (it.subtotal || 0), 0);
        const discount = parseInt(document.getElementById("invoice-discount")?.value, 10) || 0;
        const finalAmount = Math.max(0, subtotal - discount);

        const paidInput = document.getElementById("invoice-paid-amount");
        let paidAmount = parseInt(paidInput?.value, 10);
        if (isNaN(paidAmount)) {
            paidAmount = finalAmount;
            if (paidInput) paidInput.value = paidAmount;
        }

        const remaining = Math.max(0, finalAmount - paidAmount);
        const isLunas = paidAmount >= finalAmount;

        this.setText("invoice-calc-subtotal", this.formatRupiah(subtotal));
        this.setText("invoice-calc-total", this.formatRupiah(finalAmount));

        const badge = document.getElementById("invoice-calc-status-badge");
        if (badge) {
            badge.textContent = isLunas ? "LUNAS" : "TEMPO";
            badge.className = `font-bold uppercase px-2 py-0.5 rounded-full ${
                isLunas ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
            }`;
        }

        const remWrap = document.getElementById("invoice-calc-remaining-wrap");
        const remVal = document.getElementById("invoice-calc-remaining");
        if (remWrap && remVal) {
            if (remaining > 0) {
                remWrap.classList.remove("hidden");
                remVal.textContent = this.formatRupiah(remaining);
            } else {
                remWrap.classList.add("hidden");
            }
        }
    },

    handleCreateInvoiceSubmit(e) {
        e.preventDefault();
        const buyerName = document.getElementById("invoice-buyer-name")?.value.trim();
        if (!buyerName) {
            this.showToast("Masukkan nama pembeli!", "warning");
            return;
        }

        if (this.invoiceItems.length === 0) {
            this.showToast("Daftar item tidak boleh kosong!", "warning");
            return;
        }

        const buyerPhone = document.getElementById("invoice-buyer-phone")?.value.trim() || undefined;
        const date = document.getElementById("invoice-date")?.value || new Date().toISOString().split('T')[0];
        const time = document.getElementById("invoice-time")?.value || new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':');
        const discount = parseInt(document.getElementById("invoice-discount")?.value, 10) || 0;
        const subtotal = this.invoiceItems.reduce((sum, it) => sum + (it.subtotal || 0), 0);
        const finalAmount = Math.max(0, subtotal - discount);
        const paidAmount = parseInt(document.getElementById("invoice-paid-amount")?.value, 10) || 0;
        const method = document.getElementById("invoice-method")?.value || "Tunai";
        const notes = document.getElementById("invoice-notes")?.value.trim() || undefined;
        const isLunas = paidAmount >= finalAmount;

        const invoiceId = `INV-${date.replace(/-/g, '')}-${Date.now().toString().slice(-4)}`;

        const newInvoice = {
            id: invoiceId,
            buyerName: buyerName,
            buyerPhone: buyerPhone,
            date: date,
            time: time,
            items: [...this.invoiceItems],
            subtotal: subtotal,
            discount: discount,
            finalAmount: finalAmount,
            paidAmount: paidAmount,
            paymentMethod: method,
            paymentStatus: isLunas ? 'Lunas' : 'Tempo',
            notes: notes
        };

        const invoices = this.getInvoices();
        invoices.unshift(newInvoice);
        this.saveInvoices(invoices);

        // Otomatis catat transaksi kas jika ada uang masuk
        if (paidAmount > 0) {
            const transactions = this.getCashTransactions();
            transactions.unshift({
                id: `TRX-${Date.now().toString().slice(-6)}`,
                date: date,
                time: time,
                type: 'pemasukan',
                category: 'Penjualan Telur Kiloan',
                description: `Nota ${invoiceId} (${buyerName})`,
                amount: paidAmount,
                paymentMethod: method,
                customerName: buyerName,
                invoiceId: invoiceId
            });
            this.saveCashTransactions(transactions);
        }

        this.closeCreateInvoiceModal();
        this.showToast("Nota Penjualan Telur berhasil dibuat!", "success");

        // Buka langsung preview nota agar bisa langsung dicetak / dikirim via WA
        this.viewInvoiceById(invoiceId);
    },

    deleteInvoice(id) {
        if (!confirm("Apakah Anda yakin ingin menghapus nota penjualan ini?")) return;
        let invoices = this.getInvoices();
        invoices = invoices.filter(inv => inv.id !== id);
        this.saveInvoices(invoices);
        this.showToast("Nota penjualan dihapus.", "info");
    },

    // --- VIEW / PRINT / SHARE INVOICE RECEIPT ---
    viewInvoiceById(id) {
        const invoices = this.getInvoices();
        const invoice = invoices.find(inv => inv.id === id);
        if (!invoice) {
            this.showToast("Nota tidak ditemukan!", "warning");
            return;
        }

        this.activeViewingInvoice = invoice;
        const settings = this.getSettings();

        this.setText("receipt-farm-name", settings.farmName || "PETERNAKAN BAROKAH LAYER FARM");
        this.setText("receipt-coop-name", `${settings.coopName || 'Kandang Layer'} • Telur Segar Harian`);
        this.setText("receipt-invoice-id", invoice.id);
        this.setText("receipt-datetime", `${invoice.date} ${invoice.time}`);

        const statusBadge = document.getElementById("receipt-status-badge");
        if (statusBadge) {
            statusBadge.textContent = invoice.paymentStatus === 'Lunas' ? "LUNAS" : "TEMPO";
            statusBadge.className = `inline-block px-2 py-0.5 rounded-full font-bold text-[10px] ${
                invoice.paymentStatus === 'Lunas' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
            }`;
        }

        this.setText("receipt-buyer-name", invoice.buyerName);
        this.setText("receipt-buyer-phone", invoice.buyerPhone || "Tanpa No. HP");

        // Render receipt items table
        const itemsBody = document.getElementById("receipt-items-body");
        if (itemsBody) {
            itemsBody.innerHTML = invoice.items.map(it => `
                <tr>
                    <td class="py-1">${it.name}</td>
                    <td class="py-1 text-center font-mono">${it.quantity} ${it.unit}</td>
                    <td class="py-1 text-right font-mono">${this.formatRupiah(it.unitPrice)}</td>
                    <td class="py-1 text-right font-mono font-bold">${this.formatRupiah(it.subtotal)}</td>
                </tr>
            `).join("");
        }

        this.setText("receipt-subtotal", this.formatRupiah(invoice.subtotal));

        const discRow = document.getElementById("receipt-discount-row");
        if (discRow) {
            if (invoice.discount > 0) {
                discRow.classList.remove("hidden");
                this.setText("receipt-discount", `- ${this.formatRupiah(invoice.discount)}`);
            } else {
                discRow.classList.add("hidden");
            }
        }

        this.setText("receipt-final-amount", this.formatRupiah(invoice.finalAmount));
        this.setText("receipt-method", invoice.paymentMethod);
        this.setText("receipt-paid-amount", this.formatRupiah(invoice.paidAmount));

        const remRow = document.getElementById("receipt-remaining-row");
        const remaining = Math.max(0, invoice.finalAmount - invoice.paidAmount);
        if (remRow) {
            if (remaining > 0) {
                remRow.classList.remove("hidden");
                this.setText("receipt-remaining-amount", this.formatRupiah(remaining));
            } else {
                remRow.classList.add("hidden");
            }
        }

        this.setText("receipt-notes", invoice.notes ? `Catatan: ${invoice.notes}` : "");

        document.getElementById("modal-view-invoice")?.classList.remove("hidden");
        if (window.lucide) lucide.createIcons();
    },

    closeViewInvoiceModal() {
        document.getElementById("modal-view-invoice")?.classList.add("hidden");
        this.activeViewingInvoice = null;
    },

    sendInvoiceWhatsapp() {
        const invoice = this.activeViewingInvoice;
        if (!invoice) return;

        const settings = this.getSettings();
        const itemsList = invoice.items.map(it => `• ${it.name} (${it.quantity} ${it.unit}) = ${this.formatRupiah(it.subtotal)}`).join("\n");
        const remaining = Math.max(0, invoice.finalAmount - invoice.paidAmount);

        const waText =
`🧾 *NOTA PENJUALAN TELUR SEGAR*
🏠 *${settings.farmName}*
🐓 ${settings.coopName}
────────────────────────
No. Nota : *${invoice.id}*
Waktu    : ${invoice.date} ${invoice.time}
Pembeli  : *${invoice.buyerName}*
────────────────────────
*DAFTAR PEMBELIAN:*
${itemsList}
────────────────────────
Subtotal   : ${this.formatRupiah(invoice.subtotal)}${invoice.discount > 0 ? `\nDiskon     : - ${this.formatRupiah(invoice.discount)}` : ''}
*TOTAL     : ${this.formatRupiah(invoice.finalAmount)}*
Dibayar    : ${this.formatRupiah(invoice.paidAmount)} (${invoice.paymentMethod})
Status     : *${invoice.paymentStatus.toUpperCase()}*${remaining > 0 ? `\n*Sisa Tempo : ${this.formatRupiah(remaining)}*` : ''}
${invoice.notes ? `\nCatatan: ${invoice.notes}` : ''}
────────────────────────
_Terima kasih telah berbelanja telur segar langsung dari peternakan kami!_`;

        // Direct WhatsApp URL if phone is present
        let phone = (invoice.buyerPhone || "").replace(/[^0-9]/g, '');
        if (phone.startsWith('0')) {
            phone = '62' + phone.slice(1);
        }

        if (phone) {
            const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(waText)}`;
            window.open(waUrl, '_blank');
            this.showToast("Membuka WhatsApp untuk mengirim struk...", "success");
        } else {
            navigator.clipboard.writeText(waText).then(() => {
                this.showToast("Format struk disalin ke clipboard! Siap kirim via WhatsApp.", "success");
            }).catch(() => {
                this.showToast("Gagal menyalin, periksa izin browser.", "warning");
            });
        }
    },

    // ==============================================================
    // 3. FORMULIR RECORDING HARIAN
    // ==============================================================
    openAddRecordModal() {
        const modal = document.getElementById("modal-add-record");
        if (modal) {
            this.setupCurrentDate();
            modal.classList.remove("hidden");
        }
    },

    closeAddRecordModal() {
        const modal = document.getElementById("modal-add-record");
        if (modal) modal.classList.add("hidden");
    },

    saveDailyRecord() {
        const date = document.getElementById("input-rec-date")?.value;
        const dead = parseInt(document.getElementById("input-rec-dead")?.value, 10) || 0;
        const cull = parseInt(document.getElementById("input-rec-cull")?.value, 10) || 0;
        const feed = parseFloat(document.getElementById("input-rec-feed")?.value) || 0;
        const good = parseInt(document.getElementById("input-rec-good")?.value, 10) || 0;
        const cracked = parseInt(document.getElementById("input-rec-cracked")?.value, 10) || 0;
        const weight = parseFloat(document.getElementById("input-rec-weight")?.value) || 0;
        const notes = document.getElementById("input-rec-notes")?.value || "";

        if (!date || (feed <= 0 && good <= 0)) {
            this.showToast("Masukkan pakan atau jumlah telur yang valid!", "warning");
            return;
        }

        const records = this.getRecords();
        records.push({
            date: date,
            dead: dead,
            cull: cull,
            feed: feed,
            good: good,
            cracked: cracked,
            weight: weight,
            notes: notes
        });

        records.sort((a, b) => new Date(a.date) - new Date(b.date));

        this.saveRecords(records);
        this.closeAddRecordModal();
        this.showToast("Recording harian berhasil disimpan!", "success");

        if (document.getElementById("input-rec-feed")) document.getElementById("input-rec-feed").value = "";
        if (document.getElementById("input-rec-good")) document.getElementById("input-rec-good").value = "";
        if (document.getElementById("input-rec-cracked")) document.getElementById("input-rec-cracked").value = "0";
        if (document.getElementById("input-rec-weight")) document.getElementById("input-rec-weight").value = "";
        if (document.getElementById("input-rec-notes")) document.getElementById("input-rec-notes").value = "";
    },

    deleteDailyRecord(index) {
        if (!confirm("Hapus baris recording tanggal ini?")) return;
        const records = this.getRecords();
        records.splice(index, 1);
        this.saveRecords(records);
        this.showToast("Baris data dihapus.", "info");
    },

    // ==============================================================
    // 4. PENGATURAN FARM
    // ==============================================================
    openFarmSettingsModal() {
        const settings = this.getSettings();
        document.getElementById("setting-farm-name").value = settings.farmName;
        document.getElementById("setting-coop-name").value = settings.coopName;
        document.getElementById("setting-initial-pop").value = settings.initialPop;
        document.getElementById("setting-target-hd").value = settings.targetHd;
        document.getElementById("setting-period").value = settings.period;
        document.getElementById("setting-egg-price").value = settings.eggPrice;
        document.getElementById("setting-feed-price").value = settings.feedPrice;

        document.getElementById("modal-farm-settings")?.classList.remove("hidden");
    },

    closeFarmSettingsModal() {
        document.getElementById("modal-farm-settings")?.classList.add("hidden");
    },

    saveFarmSettings() {
        const farmName = document.getElementById("setting-farm-name")?.value.trim() || this.defaultSettings.farmName;
        const coopName = document.getElementById("setting-coop-name")?.value.trim() || this.defaultSettings.coopName;
        const initialPop = parseInt(document.getElementById("setting-initial-pop")?.value, 10) || this.defaultSettings.initialPop;
        const targetHd = parseFloat(document.getElementById("setting-target-hd")?.value) || this.defaultSettings.targetHd;
        const period = document.getElementById("setting-period")?.value.trim() || this.defaultSettings.period;
        const eggPrice = parseFloat(document.getElementById("setting-egg-price")?.value) || this.defaultSettings.eggPrice;
        const feedPrice = parseFloat(document.getElementById("setting-feed-price")?.value) || this.defaultSettings.feedPrice;

        this.saveSettings({
            farmName,
            coopName,
            initialPop,
            targetHd,
            period,
            eggPrice,
            feedPrice
        });

        this.closeFarmSettingsModal();
        this.calculateAndRender();
        this.renderCashbook();
        this.showToast("Pengaturan data peternakan diperbarui!", "success");
    },

    // ==============================================================
    // 5. SALIN FORMAT WHATSAPP (RECORDING STICKY NOTE)
    // ==============================================================
    copyWhatsappFormat() {
        const settings = this.getSettings();
        const records = this.getRecords();

        let currentPop = settings.initialPop;
        let totalDead = 0;
        let totalCull = 0;
        let totalFeed = 0;
        let totalGood = 0;
        let totalCracked = 0;
        let totalWeight = 0;
        let popSum = 0;

        records.forEach(rec => {
            totalDead += rec.dead;
            totalCull += rec.cull;
            currentPop = currentPop - rec.dead - rec.cull;
            popSum += currentPop;
            totalFeed += rec.feed;
            totalGood += rec.good;
            totalCracked += rec.cracked;
            totalWeight += rec.weight;
        });

        const days = records.length || 1;
        const avgPop = records.length > 0 ? (popSum / records.length) : settings.initialPop;
        const totalEggs = totalGood + totalCracked;
        const gramPerEkor = (avgPop > 0 && days > 0) ? (totalFeed * 1000) / (avgPop * days) : 0;
        const avgHd = (avgPop > 0 && days > 0) ? (totalEggs / (avgPop * days)) * 100 : 0;
        const fcrRatio = totalWeight > 0 ? (totalFeed / totalWeight) : 0;
        const eggWeightAvg = totalEggs > 0 ? (totalWeight * 1000) / totalEggs : 0;

        const pendapatan = totalWeight * settings.eggPrice;
        const biaya = totalFeed * settings.feedPrice;
        const laba = pendapatan - biaya;
        const hpp = totalWeight > 0 ? (biaya / totalWeight) : 0;

        const waText = 
`📌 *LAPORAN RECORDING PETERNAKAN AYAM*
🏷️ ${settings.period}
🏠 *${settings.farmName}*
🐓 Kandang: ${settings.coopName}
────────────────────────
🐔 *Populasi Akhir:* ${currentPop} Ekor (Mati: ${totalDead} | Afkir: ${totalCull})
🌾 *Total Pakan:* ${totalFeed.toFixed(2)} Kg (${gramPerEkor.toFixed(1)} gr/ekor)
🥚 *Total Telur:* ${totalEggs} Butir (${totalGood} Utuh | ${totalCracked} Retak)
⚖️ *Berat Telur:* ${totalWeight.toFixed(2)} Kg (Rata: ${(totalEggs / days).toFixed(1)} btr/hari)
📈 *Rata-rata HD:* ${avgHd.toFixed(2)}% (Target: ${settings.targetHd}%)
📊 *FCR Ratio:* ${fcrRatio.toFixed(2)} (EW: ${eggWeightAvg.toFixed(1)} gr/btr)
────────────────────────
💰 *Estimasi Laba Kotor Pakan:* Rp ${Math.round(laba).toLocaleString('id-ID')}
💵 Pendapatan: Rp ${Math.round(pendapatan).toLocaleString('id-ID')}
💸 Biaya Pakan: Rp ${Math.round(biaya).toLocaleString('id-ID')}
🏷️ *HPP Pakan Rata-rata:* Rp ${Math.round(hpp).toLocaleString('id-ID')} /kg
────────────────────────
_Laporan dibuat otomatis via EggPro / King Endog App_`;

        navigator.clipboard.writeText(waText).then(() => {
            this.showToast("Format laporan WhatsApp disalin ke clipboard! 📋", "success");
        }).catch(() => {
            this.showToast("Gagal menyalin, periksa izin browser.", "warning");
        });
    },

    // ==============================================================
    // 6. QR CODE UNTUK BUKA DI HP
    // ==============================================================
    // 6. QR CODE UNTUK BUKA DI HP (LOKAL & VERCEL ONLINE)
    // ==============================================================
    openQrModal() {
        const modal = document.getElementById("modal-qr");
        const container = document.getElementById("qrcode-container");
        const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
        
        let fullUrl = window.location.href.split('#')[0];
        if (isLocal) {
            const port = window.location.port || "3000";
            fullUrl = `http://192.168.1.19:${port}`;
        }

        const urlEl = document.getElementById("qr-modal-url");
        if (urlEl) urlEl.textContent = fullUrl;

        const labelEl = document.getElementById("qr-modal-label");
        if (labelEl) labelEl.textContent = isLocal ? "Alamat Wi-Fi Lokal:" : "Link Web Vercel Online:";

        const hintEl = document.getElementById("qr-modal-hint");
        if (hintEl) {
            hintEl.textContent = isLocal 
                ? "Pastikan HP & Laptop terhubung di Wi-Fi yang sama." 
                : "Akses online dari HP di mana saja tanpa perlu Wi-Fi laptop.";
        }

        if (container && window.QRCode) {
            container.innerHTML = "";
            new QRCode(container, {
                text: fullUrl,
                width: 140,
                height: 140,
                colorDark: "#92400e",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.M
            });
        }

        if (modal) modal.classList.remove("hidden");
    },

    closeQrModal() {
        document.getElementById("modal-qr")?.classList.add("hidden");
    },

    // ==============================================================
    // 7. CADANGAN & PEMULIHAN DATA (BACKUP & RESTORE JSON)
    // ==============================================================
    exportDataBackup() {
        const backupData = {
            version: "1.0",
            exportedAt: new Date().toISOString(),
            settings: this.getSettings(),
            records: this.getRecords(),
            transactions: this.getCashTransactions(),
            invoices: this.getInvoices()
        };

        const jsonStr = JSON.stringify(backupData, null, 2);
        const blob = new Blob([jsonStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        const today = new Date().toISOString().split('T')[0];
        a.href = url;
        a.download = `backup_king_endog_${today}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showToast("File cadangan data berhasil diunduh! 💾", "success");
    },

    importDataBackup(event) {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const parsed = JSON.parse(e.target.result);
                if (parsed.settings) this.saveSettings(parsed.settings);
                if (Array.isArray(parsed.records)) this.saveRecords(parsed.records);
                if (Array.isArray(parsed.transactions)) this.saveCashTransactions(parsed.transactions);
                if (Array.isArray(parsed.invoices)) this.saveInvoices(parsed.invoices);

                this.calculateAndRender();
                this.renderCashbook();
                this.closeFarmSettingsModal();
                this.showToast("Data cadangan berhasil dipulihkan 100%! 📥", "success");
            } catch (err) {
                this.showToast("Format file cadangan tidak valid!", "warning");
            }
        };
        reader.readAsText(file);
        event.target.value = "";
    },

    showToast(msg, type = "info") {
        const box = document.getElementById("toast-box");
        if (!box) return;

        const colors = {
            success: "bg-emerald-600",
            warning: "bg-amber-600",
            info: "bg-gray-800"
        };

        const toast = document.createElement("div");
        toast.className = `p-3.5 mb-2 rounded-2xl text-white text-xs font-bold shadow-xl transition-all duration-300 transform translate-y-2 opacity-0 text-center ${colors[type] || colors.info}`;
        toast.textContent = msg;

        box.appendChild(toast);
        requestAnimationFrame(() => {
            toast.classList.remove("translate-y-2", "opacity-0");
        });

        setTimeout(() => {
            toast.classList.add("opacity-0", "translate-y-2");
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    // ==============================================================
    // CLOUD REALTIME SYNC (FIREBASE FIRESTORE & REALTIME DB)
    // ==============================================================
    cloudSync: {
        STORAGE_CONFIG: "eggpro_firebase_config",
        STORAGE_LAST_SYNC: "eggpro_last_sync_time",
        farmDocId: "farm_data",
        db: null,
        rtdb: null,
        unsubscribe: null,
        isConnected: false,
        lastLocalSaveTime: 0,
        isSyncing: false,

        // Konfigurasi Bawaan Resmi Proyek King Endog
        defaultFirebaseConfig: {
            apiKey: "AIzaSyDxpQitwgTE7HPJ23tKAyH3eWOQZTcCLEk",
            authDomain: "king-endog.firebaseapp.com",
            databaseURL: "https://king-endog-default-rtdb.asia-southeast1.firebasedatabase.app",
            projectId: "king-endog",
            storageBucket: "king-endog.firebasestorage.app",
            messagingSenderId: "421502559616",
            appId: "1:421502559616:web:d16a0484df9c0fc3e14d65",
            measurementId: "G-SZ5TN7PZG3"
        },

        init() {
            // 1. Cek apakah ada token sinkronisasi dari URL hash (#sync=... atau ?sync=...)
            const urlConfig = this.checkUrlSync();

            // 2. Ambil config dari localStorage atau default king-endog
            const config = urlConfig || this.getConfig();

            if (config) {
                this.connectFirebase(config);
            } else {
                this.updateStatusUI(false);
                this.tryLocalServerSync();
            }
        },

        getConfig() {
            try {
                const stored = JSON.parse(localStorage.getItem(this.STORAGE_CONFIG));
                if (stored && stored.apiKey && stored.projectId) return stored;
            } catch (e) {}
            return this.defaultFirebaseConfig;
        },

        checkUrlSync() {
            let hash = window.location.hash || '';
            if (!hash && window.location.search) {
                const params = new URLSearchParams(window.location.search);
                if (params.has('sync')) {
                    hash = '#sync=' + params.get('sync');
                }
            }
            if (hash.startsWith('#sync=')) {
                try {
                    const encoded = hash.replace('#sync=', '');
                    const jsonStr = decodeURIComponent(escape(atob(decodeURIComponent(encoded))));
                    const config = JSON.parse(jsonStr);
                    if (config && config.apiKey && config.projectId) {
                        localStorage.setItem(this.STORAGE_CONFIG, JSON.stringify(config));
                        if (window.history && window.history.replaceState) {
                            window.history.replaceState(null, '', window.location.pathname);
                        }
                        EggApp.showToast("🎉 HP Berhasil terhubung ke Cloud Sync!", "success");
                        return config;
                    }
                } catch (err) {
                    console.error("Gagal membaca kode sync dari URL:", err);
                }
            }
            return null;
        },

        connectFirebase(config) {
            try {
                if (!window.firebase) {
                    console.warn("Firebase SDK belum termuat.");
                    this.updateStatusUI(false, "Firebase SDK belum termuat di browser.");
                    return;
                }

                // Inisialisasi Firebase jika belum
                if (!firebase.apps.length) {
                    firebase.initializeApp(config);
                }

                // Siapkan Firestore & Realtime Database
                this.db = (firebase.firestore) ? firebase.firestore() : null;
                this.rtdb = (config.databaseURL && firebase.database) ? firebase.database() : null;

                this.isConnected = true;
                this.updateStatusUI(true, "Terhubung ke Firebase King Endog");

                // Dengarkan perubahan real-time
                this.listenRealtime();

                // Render QR code share HP
                this.renderHpShare(config);
            } catch (err) {
                console.error("Firebase connection error:", err);
                this.isConnected = false;
                this.updateStatusUI(false, "Gagal koneksi: " + err.message);
            }
        },

        listenRealtime() {
            let hasActiveListener = false;

            // 1. Realtime Database Listener (Ultra Fast <50ms)
            if (this.rtdb) {
                try {
                    this.rtdb.ref("farm_data").on("value", (snapshot) => {
                        const cloudData = snapshot.val();
                        if (!cloudData) {
                            this.pushData(true);
                            return;
                        }
                        this.applyRemoteData(cloudData);
                    }, (error) => {
                        console.warn("RTDB listen notice:", error.message);
                        if (this.db) this.listenFirestore();
                    });
                    hasActiveListener = true;
                } catch (e) {
                    console.warn("RTDB init fail:", e);
                }
            }

            // 2. Firestore Listener (Fallback atau Paralel)
            if (this.db && !hasActiveListener) {
                this.listenFirestore();
            }
        },

        listenFirestore() {
            if (!this.db) return;
            if (this.unsubscribe) this.unsubscribe();
            const docRef = this.db.collection("farms").doc(this.farmDocId);
            this.unsubscribe = docRef.onSnapshot((doc) => {
                if (!doc.exists) {
                    this.pushData(true);
                    return;
                }
                const cloudData = doc.data();
                if (cloudData) this.applyRemoteData(cloudData);
            }, (error) => {
                console.warn("Firestore listen notice:", error.message);
            });
        },

        applyRemoteData(cloudData) {
            if (!cloudData) return;
            if (cloudData.updatedAt && cloudData.updatedAt > this.lastLocalSaveTime) {
                this.isSyncing = true;
                
                if (cloudData.settings) {
                    localStorage.setItem(EggApp.STORAGE_SETTINGS, JSON.stringify(cloudData.settings));
                }
                if (Array.isArray(cloudData.records)) {
                    localStorage.setItem(EggApp.STORAGE_RECORDS, JSON.stringify(cloudData.records));
                }
                if (Array.isArray(cloudData.transactions)) {
                    localStorage.setItem(EggApp.STORAGE_TRANSACTIONS, JSON.stringify(cloudData.transactions));
                }
                if (Array.isArray(cloudData.invoices)) {
                    localStorage.setItem(EggApp.STORAGE_INVOICES, JSON.stringify(cloudData.invoices));
                }

                this.lastLocalSaveTime = cloudData.updatedAt;

                // Re-render UI
                EggApp.calculateAndRender();
                EggApp.renderCashbook();

                const sender = cloudData.updatedBy || "perangkat lain";
                EggApp.showToast(`🔄 Data otomatis tersinkron dari ${sender}!`, "info");
                
                this.updateStatusUI(true, `Tersinkron (${new Date().toLocaleTimeString('id-ID')})`);
                this.isSyncing = false;
            }
        },

        pushData(force = false) {
            if (this.isSyncing) return;

            // Jika Firebase terhubung
            if (this.isConnected) {
                this.lastLocalSaveTime = Date.now();
                const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                const deviceName = isMobile ? 'HP / Smartphone' : 'Laptop / Komputer';

                const payload = {
                    settings: EggApp.getSettings(),
                    records: EggApp.getRecords(),
                    transactions: EggApp.getCashTransactions(),
                    invoices: EggApp.getInvoices(),
                    updatedAt: this.lastLocalSaveTime,
                    updatedBy: deviceName
                };

                // 1. Simpan ke Firebase Realtime Database
                if (this.rtdb) {
                    this.rtdb.ref("farm_data").set(payload)
                        .then(() => {
                            this.updateStatusUI(true, `Tersimpan ke Cloud (${new Date().toLocaleTimeString('id-ID')})`);
                        })
                        .catch(err => {
                            console.warn("RTDB set notice:", err.message);
                        });
                }

                // 2. Simpan juga ke Firestore
                if (this.db) {
                    this.db.collection("farms").doc(this.farmDocId).set(payload, { merge: true })
                        .then(() => {
                            this.updateStatusUI(true, `Tersimpan ke Cloud (${new Date().toLocaleTimeString('id-ID')})`);
                        })
                        .catch(err => {
                            console.warn("Firestore set notice:", err.message);
                        });
                }
            } else {
                // Fallback ke local Wi-Fi server jika tersedia
                this.pushLocalServer();
            }
        },

        tryLocalServerSync() {
            // Jika berjalan di laptop / Wi-Fi IP lokal, coba sinkron dengan server.ps1
            const isLocal = location.hostname === 'localhost' || location.hostname === '127.0.0.1' || /^192\.168\./.test(location.hostname);
            if (!isLocal) return;

            fetch('/api/data', { method: 'GET' })
                .then(r => r.json())
                .then(data => {
                    if (data && data.updatedAt && data.updatedAt > this.lastLocalSaveTime) {
                        if (data.settings) localStorage.setItem(EggApp.STORAGE_SETTINGS, JSON.stringify(data.settings));
                        if (Array.isArray(data.records)) localStorage.setItem(EggApp.STORAGE_RECORDS, JSON.stringify(data.records));
                        if (Array.isArray(data.transactions)) localStorage.setItem(EggApp.STORAGE_TRANSACTIONS, JSON.stringify(data.transactions));
                        if (Array.isArray(data.invoices)) localStorage.setItem(EggApp.STORAGE_INVOICES, JSON.stringify(data.invoices));
                        this.lastLocalSaveTime = data.updatedAt;
                        EggApp.calculateAndRender();
                        EggApp.renderCashbook();
                        EggApp.showToast("Data tersinkron dari server Wi-Fi lokal!", "info");
                    }
                })
                .catch(() => {});
        },

        pushLocalServer() {
            const isLocal = location.hostname === 'localhost' || location.hostname === '127.0.0.1' || /^192\.168\./.test(location.hostname);
            if (!isLocal) return;

            const payload = {
                settings: EggApp.getSettings(),
                records: EggApp.getRecords(),
                transactions: EggApp.getCashTransactions(),
                invoices: EggApp.getInvoices(),
                updatedAt: Date.now()
            };

            fetch('/api/data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            }).catch(() => {});
        },

        updateStatusUI(connected, message = '') {
            this.isConnected = connected;

            const topDot = document.getElementById("cloud-sync-dot");
            const topText = document.getElementById("cloud-sync-text");
            const navDot = document.getElementById("badge-nav-cloud-dot");
            const navText = document.getElementById("badge-nav-cloud-text");
            const statusCard = document.getElementById("cloud-status-card");
            const statusDot = document.getElementById("cloud-status-dot");
            const statusTitle = document.getElementById("cloud-status-text");
            const statusDesc = document.getElementById("cloud-status-desc");
            const btnDisconnect = document.getElementById("btn-disconnect-cloud");
            const shareCard = document.getElementById("cloud-share-hp-card");

            if (connected) {
                if (topDot) topDot.className = "w-2.5 h-2.5 rounded-full bg-emerald-400";
                if (topText) topText.textContent = "🟢 Cloud Terhubung";
                if (navDot) navDot.className = "w-2 h-2 rounded-full bg-emerald-500 animate-pulse";
                if (navText) navText.textContent = message || "Cloud Terhubung (Real-time Aktif)";

                if (statusCard) {
                    statusCard.className = "p-4 rounded-2xl border transition bg-emerald-50 border-emerald-200 text-emerald-900";
                }
                if (statusDot) statusDot.className = "w-3 h-3 rounded-full bg-emerald-500 mt-1 flex-shrink-0 animate-pulse";
                if (statusTitle) statusTitle.textContent = "🟢 Cloud Terhubung (Real-time Sync Aktif)";
                if (statusDesc) statusDesc.textContent = "Semua data transaksi di HP dan Laptop sekarang otomatis tersinkronisasi secara real-time! " + (message ? `(${message})` : '');
                
                if (btnDisconnect) btnDisconnect.classList.remove("hidden");
                if (shareCard) shareCard.classList.remove("hidden");
            } else {
                if (topDot) topDot.className = "w-2.5 h-2.5 rounded-full bg-amber-400";
                if (topText) topText.textContent = "☁️ Sinkron HP & Laptop";
                if (navDot) navDot.className = "w-2 h-2 rounded-full bg-amber-500";
                if (navText) navText.textContent = "Mode Offline (Klik untuk Hubungkan Cloud)";

                if (statusCard) {
                    statusCard.className = "p-4 rounded-2xl border transition bg-amber-50/70 border-amber-200 text-amber-900";
                }
                if (statusDot) statusDot.className = "w-3 h-3 rounded-full bg-amber-500 mt-1 flex-shrink-0 animate-pulse";
                if (statusTitle) statusTitle.textContent = "Mode Offline (Belum Terhubung Cloud)";
                if (statusDesc) statusDesc.textContent = message || "Data transaksi saat ini hanya tersimpan di memori browser perangkat ini. Hubungkan dengan Firebase Firestore gratis agar HP & Laptop saling tersinkron otomatis.";
                
                if (btnDisconnect) btnDisconnect.classList.add("hidden");
                if (shareCard) shareCard.classList.add("hidden");
            }
        },

        renderHpShare(config) {
            const container = document.getElementById("cloud-hp-qrcode");
            const inputLink = document.getElementById("cloud-hp-link-input");
            if (!container || !inputLink) return;

            container.innerHTML = "";

            const compactConfig = {
                apiKey: config.apiKey,
                projectId: config.projectId,
                authDomain: config.authDomain,
                storageBucket: config.storageBucket,
                messagingSenderId: config.messagingSenderId,
                appId: config.appId
            };

            const jsonStr = JSON.stringify(compactConfig);
            const encoded = btoa(unescape(encodeURIComponent(jsonStr)));
            const origin = window.location.origin;
            const path = window.location.pathname;
            const hpUrl = `${origin}${path}#sync=${encoded}`;

            inputLink.value = hpUrl;

            if (window.QRCode) {
                new QRCode(container, {
                    text: hpUrl,
                    width: 120,
                    height: 120,
                    colorDark: "#065f46",
                    colorLight: "#ffffff",
                    correctLevel: QRCode.CorrectLevel.M
                });
            }
        }
    },

    // Modal Helper Methods for Cloud Sync
    openCloudSyncModal() {
        const modal = document.getElementById("modal-cloud-sync");
        if (!modal) return;
        modal.classList.remove("hidden");

        const config = this.cloudSync.getConfig();
        const textarea = document.getElementById("input-firebase-config");
        if (config && textarea) {
            textarea.value = JSON.stringify(config, null, 2);
        }

        this.cloudSync.updateStatusUI(this.cloudSync.isConnected);
        if (config) {
            this.cloudSync.renderHpShare(config);
        }

        if (window.lucide) {
            lucide.createIcons();
        }
    },

    closeCloudSyncModal() {
        document.getElementById("modal-cloud-sync")?.classList.add("hidden");
    },

    toggleFirebaseGuide() {
        const guide = document.getElementById("firebase-guide-box");
        const label = document.getElementById("guide-toggle-label");
        if (!guide) return;
        if (guide.classList.contains("hidden")) {
            guide.classList.remove("hidden");
            if (label) label.textContent = "Tutup Panduan";
        } else {
            guide.classList.add("hidden");
            if (label) label.textContent = "Panduan Cepat (2 Menit)";
        }
    },

    saveCloudConfig() {
        const textarea = document.getElementById("input-firebase-config");
        if (!textarea) return;
        const raw = textarea.value.trim();
        if (!raw) {
            this.showToast("Silakan tempel konfigurasi Firebase terlebih dahulu!", "warning");
            return;
        }

        let parsedConfig = null;

        // Coba JSON biasa
        try {
            parsedConfig = JSON.parse(raw);
        } catch (e) {
            // Coba ekstrak properti objek Javascript
            try {
                const match = raw.match(/\{[\s\S]*\}/);
                if (match) {
                    const fn = new Function(`return (${match[0]})`);
                    parsedConfig = fn();
                }
            } catch (err) {
                // Regex extractor
                const apiKey = (raw.match(/apiKey\s*:\s*["']([^"']+)["']/) || [])[1];
                const projectId = (raw.match(/projectId\s*:\s*["']([^"']+)["']/) || [])[1];
                const authDomain = (raw.match(/authDomain\s*:\s*["']([^"']+)["']/) || [])[1];
                const appId = (raw.match(/appId\s*:\s*["']([^"']+)["']/) || [])[1];
                if (apiKey && projectId) {
                    parsedConfig = { apiKey, projectId, authDomain, appId };
                }
            }
        }

        if (!parsedConfig || !parsedConfig.apiKey || !parsedConfig.projectId) {
            this.showToast("Konfigurasi tidak valid! Pastikan mengandung apiKey dan projectId.", "warning");
            return;
        }

        localStorage.setItem(this.cloudSync.STORAGE_CONFIG, JSON.stringify(parsedConfig));
        this.cloudSync.connectFirebase(parsedConfig);
        this.cloudSync.pushData(true);
        this.showToast("🎉 Konfigurasi Cloud Sync berhasil disimpan dan aktif!", "success");
    },

    disconnectCloud() {
        if (!confirm("Apakah Anda yakin ingin memutuskan sinkronisasi cloud? Aplikasi akan kembali ke mode offline lokal.")) return;
        localStorage.removeItem(this.cloudSync.STORAGE_CONFIG);
        if (this.cloudSync.unsubscribe) {
            this.cloudSync.unsubscribe();
        }
        this.cloudSync.isConnected = false;
        this.cloudSync.db = null;
        this.cloudSync.updateStatusUI(false);
        const textarea = document.getElementById("input-firebase-config");
        if (textarea) textarea.value = "";
        this.showToast("Sinkronisasi cloud telah dinonaktifkan.", "info");
    },

    copyCloudHpLink() {
        const input = document.getElementById("cloud-hp-link-input");
        if (!input || !input.value) return;

        navigator.clipboard.writeText(input.value)
            .then(() => {
                this.showToast("Link HP berhasil disalin ke clipboard! 📋", "success");
            })
            .catch(() => {
                input.select();
                document.execCommand("copy");
                this.showToast("Link HP berhasil disalin! 📋", "success");
            });
    }
};

window.EggApp = EggApp;

document.addEventListener("DOMContentLoaded", () => {
    EggApp.init();
});

// Shortcut Keyboard Desktop: Tombol Escape untuk menutup modal
window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        EggApp.closeAllModals();
    }
});
