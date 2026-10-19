import React, { useState } from 'react';
import { Wallet, ArrowUpRight, ArrowDownRight, Receipt, Plus, Search, Trash2, Eye, X } from 'lucide-react';
import { CashTransaction, SalesInvoice, CashTransactionType } from '../types/cashbook.ts';
import { FarmSettings } from '../types/recording.ts';
import { formatRupiah } from '../utils/stickyNoteExport.ts';

interface EggCashbookSectionProps {
  transactions: CashTransaction[];
  invoices: SalesInvoice[];
  settings: FarmSettings;
  onAddTransaction: (trx: Omit<CashTransaction, 'id'>) => void;
  onDeleteTransaction: (id: string) => void;
  onOpenCreateInvoice: () => void;
  onViewInvoice: (invoice: SalesInvoice) => void;
  onDeleteInvoice: (id: string) => void;
}

export const KATEGORI_PENGELUARAN = [
  'Pembelian Pakan',
  'Obat & Vaksin & Vitamin',
  'Operasional Listrik & Air',
  'Sekam & Sanitasi Kandang',
  'Gaji & Upah Tenaga Kerja',
  'Pembelian Egg Tray / Kardus',
  'Perawatan / Servis Peralatan',
  'Pengeluaran Lainnya',
];

export const KATEGORI_PEMASUKAN = [
  'Penjualan Telur Kiloan',
  'Penjualan Telur Butir/Tray',
  'Penjualan Telur Bentes / Retak',
  'Penjualan Ayam Afkir',
  'Penjualan Pupuk / Kotoran Kandang',
  'Pemasukan Lainnya',
];

export const EggCashbookSection: React.FC<EggCashbookSectionProps> = ({
  transactions,
  invoices,
  settings,
  onAddTransaction,
  onDeleteTransaction,
  onOpenCreateInvoice,
  onViewInvoice,
  onDeleteInvoice,
}) => {
  const [activeTab, setActiveTab] = useState<'transaksi' | 'nota'>('transaksi');
  const [filterType, setFilterType] = useState<'semua' | 'pemasukan' | 'pengeluaran' | 'tempo'>('semua');
  const [searchQuery, setSearchQuery] = useState('');

  // Manual Transaction Modal State
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [manualType, setManualType] = useState<CashTransactionType>('pengeluaran');
  const [manualCategory, setManualCategory] = useState(KATEGORI_PENGELUARAN[0]);
  const [manualAmount, setManualAmount] = useState('');
  const [manualDesc, setManualDesc] = useState('');
  const [manualCustomer, setManualCustomer] = useState('');
  const [manualMethod, setManualMethod] = useState<'Tunai' | 'Transfer Bank' | 'QRIS' | 'Tempo'>('Tunai');

  // Calculations
  const totalPemasukan = transactions
    .filter((t) => t.type === 'pemasukan')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalPengeluaran = transactions
    .filter((t) => t.type === 'pengeluaran')
    .reduce((sum, t) => sum + t.amount, 0);

  const saldoBersih = totalPemasukan - totalPengeluaran;

  // Total Piutang (Tempo)
  const totalPiutang = invoices
    .filter((inv) => inv.paymentStatus === 'Tempo' || inv.finalAmount > inv.paidAmount)
    .reduce((sum, inv) => sum + (inv.finalAmount - inv.paidAmount), 0);

  // Filter transactions
  const filteredTransactions = transactions
    .filter((t) => {
      if (filterType === 'pemasukan') return t.type === 'pemasukan';
      if (filterType === 'pengeluaran') return t.type === 'pengeluaran';
      if (filterType === 'tempo') return t.paymentMethod === 'Tempo';
      return true;
    })
    .filter((t) => {
      const q = searchQuery.toLowerCase();
      return (
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        (t.customerName && t.customerName.toLowerCase().includes(q))
      );
    })
    .sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time));

  // Filter invoices
  const filteredInvoices = invoices.filter((inv) => {
    const q = searchQuery.toLowerCase();
    return (
      inv.buyerName.toLowerCase().includes(q) ||
      inv.id.toLowerCase().includes(q) ||
      (inv.buyerPhone && inv.buyerPhone.includes(q))
    );
  });

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(manualAmount.replace(/[^0-9]/g, ''), 10);
    if (!amount || isNaN(amount) || amount <= 0) return;

    const today = new Date().toISOString().split('T')[0];
    const timeNow = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    onAddTransaction({
      date: today,
      time: timeNow,
      type: manualType,
      category: manualCategory,
      description: manualDesc.trim() || manualCategory,
      amount,
      paymentMethod: manualMethod,
      customerName: manualCustomer.trim() || undefined,
    });

    setManualAmount('');
    setManualDesc('');
    setManualCustomer('');
    setIsManualModalOpen(false);
  };

  return (
    <div id="cashbookSection" className="space-y-6 pb-6">
      {/* 4 Financial Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Saldo */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-xs border border-slate-200 border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-1">
            <span>Saldo Kas Bersih</span>
            <Wallet className="w-4 h-4 text-amber-600" />
          </div>
          <h3
            className={`text-lg sm:text-2xl font-bold font-mono tabular-nums ${
              saldoBersih >= 0 ? 'text-slate-800' : 'text-rose-600'
            }`}
          >
            {formatRupiah(saldoBersih)}
          </h3>
          <p className="text-[10px] text-slate-500 mt-1">Pemasukan dikurangi pengeluaran</p>
        </div>

        {/* Total Pemasukan */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-xs border border-slate-200 border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-1">
            <span>Total Pemasukan</span>
            <ArrowUpRight className="w-4 h-4 text-emerald-600" />
          </div>
          <h3 className="text-lg sm:text-2xl font-bold font-mono tabular-nums text-emerald-700">
            {formatRupiah(totalPemasukan)}
          </h3>
          <p className="text-[10px] text-slate-500 mt-1">Penjualan telur & hasil ternak</p>
        </div>

        {/* Total Pengeluaran */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-xs border border-slate-200 border-l-4 border-l-rose-500">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-1">
            <span>Total Pengeluaran</span>
            <ArrowDownRight className="w-4 h-4 text-rose-500" />
          </div>
          <h3 className="text-lg sm:text-2xl font-bold font-mono tabular-nums text-rose-600">
            {formatRupiah(totalPengeluaran)}
          </h3>
          <p className="text-[10px] text-slate-500 mt-1">Pakan, vitamin & operasional</p>
        </div>

        {/* Total Piutang / Tempo */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-xs border border-slate-200 border-l-4 border-l-indigo-500">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-1">
            <span>Piutang / Tempo</span>
            <Receipt className="w-4 h-4 text-indigo-600" />
          </div>
          <h3 className="text-lg sm:text-2xl font-bold font-mono tabular-nums text-indigo-700">
            {formatRupiah(totalPiutang)}
          </h3>
          <p className="text-[10px] text-slate-500 mt-1">Tagihan pelanggan belum lunas</p>
        </div>
      </div>

      {/* Main Cashbook & Invoices Area */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-xs border border-slate-200 space-y-4">
        {/* Header Bar with Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-800 flex items-center space-x-2">
              <Wallet className="w-5 h-5 text-amber-600" />
              <span>Buku Kas & Nota Penjualan Telur</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Pencatatan kas masuk/keluar peternakan dan pembuatan nota struk instan untuk pembeli.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setManualType('pengeluaran');
                setManualCategory(KATEGORI_PENGELUARAN[0]);
                setIsManualModalOpen(true);
              }}
              className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-xl font-medium transition flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Catat Pengeluaran</span>
            </button>

            <button
              onClick={() => {
                setManualType('pemasukan');
                setManualCategory(KATEGORI_PEMASUKAN[0]);
                setIsManualModalOpen(true);
              }}
              className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-xl font-medium transition flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Pemasukan Kas</span>
            </button>

            <button
              onClick={onOpenCreateInvoice}
              className="text-xs bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-bold px-3.5 py-2 rounded-xl transition flex items-center space-x-1.5 shadow-xs"
            >
              <Receipt className="w-4 h-4" />
              <span>+ Buat Nota Penjualan</span>
            </button>
          </div>
        </div>

        {/* View Switcher: Buku Kas vs Daftar Nota */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Main Tab Toggle */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl text-xs font-semibold text-slate-600">
            <button
              onClick={() => setActiveTab('transaksi')}
              className={`px-3.5 py-1.5 rounded-lg transition ${
                activeTab === 'transaksi' ? 'bg-white shadow-xs text-amber-900 font-bold' : 'hover:text-amber-800'
              }`}
            >
              Buku Kas ({transactions.length})
            </button>
            <button
              onClick={() => setActiveTab('nota')}
              className={`px-3.5 py-1.5 rounded-lg transition ${
                activeTab === 'nota' ? 'bg-white shadow-xs text-amber-900 font-bold' : 'hover:text-amber-800'
              }`}
            >
              Daftar Nota Penjualan ({invoices.length})
            </button>
          </div>

          {/* Sub Filters for Transaksi */}
          {activeTab === 'transaksi' && (
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              {(['semua', 'pemasukan', 'pengeluaran', 'tempo'] as const).map((ft) => (
                <button
                  key={ft}
                  onClick={() => setFilterType(ft)}
                  className={`px-2.5 py-1 rounded-lg transition capitalize font-medium ${
                    filterType === ft ? 'bg-slate-800 text-white font-bold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {ft === 'tempo' ? 'Tempo (Piutang)' : ft}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              activeTab === 'transaksi'
                ? 'Cari transaksi berdasarkan keterangan, kategori, atau nama pembeli...'
                : 'Cari nota berdasarkan nama pembeli, nomor nota, atau HP...'
            }
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 focus:bg-white"
          />
        </div>

        {/* TAB 1: BUKU KAS TRANSAKSI TABLE */}
        {activeTab === 'transaksi' && (
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200 uppercase text-[10px] tracking-wider">
                  <th className="py-2.5 px-3">Waktu</th>
                  <th className="py-2.5 px-2.5">Kategori</th>
                  <th className="py-2.5 px-3">Keterangan & Pihak Terkait</th>
                  <th className="py-2.5 px-2 text-center">Metode</th>
                  <th className="py-2.5 px-3 text-right">Nominal (Rp)</th>
                  <th className="py-2.5 px-2 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400 text-xs">
                      Tidak ada transaksi kas yang sesuai
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((trx) => (
                    <tr key={trx.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-2.5 px-3 font-mono tabular-nums text-slate-600 text-[11px] whitespace-nowrap">
                        {trx.date} <span className="text-slate-400">{trx.time}</span>
                      </td>
                      <td className="py-2.5 px-2.5 whitespace-nowrap">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                            trx.type === 'pemasukan'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          {trx.category}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="font-medium text-slate-800">{trx.description}</div>
                        {trx.customerName && (
                          <div className="text-[10px] text-slate-400">Pihak: {trx.customerName}</div>
                        )}
                      </td>
                      <td className="py-2.5 px-2 text-center whitespace-nowrap">
                        <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-medium">
                          {trx.paymentMethod}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono tabular-nums font-bold text-xs whitespace-nowrap">
                        <span className={trx.type === 'pemasukan' ? 'text-emerald-700' : 'text-rose-600'}>
                          {trx.type === 'pemasukan' ? '+' : '-'} {formatRupiah(trx.amount)}
                        </span>
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        <div className="flex items-center justify-center space-x-1">
                          {trx.invoiceId && (
                            <button
                              onClick={() => {
                                const found = invoices.find((inv) => inv.id === trx.invoiceId);
                                if (found) onViewInvoice(found);
                              }}
                              className="text-amber-600 hover:text-amber-800 p-1 rounded"
                              title="Lihat Nota Penjualan"
                            >
                              <Receipt className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => onDeleteTransaction(trx.id)}
                            className="text-slate-300 hover:text-rose-600 p-1 rounded"
                            title="Hapus transaksi"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 2: DAFTAR NOTA PENJUALAN */}
        {activeTab === 'nota' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredInvoices.length === 0 ? (
              <div className="col-span-2 py-12 text-center text-slate-400 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200">
                Belum ada nota penjualan dibuat. Klik tombol "+ Buat Nota Penjualan" untuk mulai membuat nota.
              </div>
            ) : (
              filteredInvoices.map((inv) => (
                <div
                  key={inv.id}
                  className="bg-slate-50/70 border border-slate-200 hover:border-amber-300 rounded-xl p-4 space-y-3 transition-colors text-xs"
                >
                  <div className="flex justify-between items-start border-b border-slate-200/70 pb-2.5">
                    <div>
                      <span className="font-mono font-bold text-amber-900 text-xs">{inv.id}</span>
                      <h4 className="font-bold text-slate-800 text-sm mt-0.5">{inv.buyerName}</h4>
                      <p className="text-slate-500 text-[11px]">{inv.buyerPhone || '-'}</p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          inv.paymentStatus === 'Lunas'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {inv.paymentStatus === 'Lunas' ? 'LUNAS' : 'TEMPO'}
                      </span>
                      <p className="text-[10px] text-slate-400 font-mono mt-1">
                        {inv.date} {inv.time}
                      </p>
                    </div>
                  </div>

                  {/* Items summary */}
                  <div className="space-y-1 text-slate-600">
                    {inv.items.map((it, i) => (
                      <div key={i} className="flex justify-between text-[11px]">
                        <span>
                          {it.name} ({it.quantity} {it.unit})
                        </span>
                        <span className="font-mono tabular-nums font-semibold">
                          {formatRupiah(it.subtotal)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Total & Action */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/70">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Tagihan</span>
                      <p className="text-sm font-bold font-mono tabular-nums text-emerald-700">
                        {formatRupiah(inv.finalAmount)}
                      </p>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => onViewInvoice(inv)}
                        className="bg-white hover:bg-amber-50 text-amber-800 border border-slate-200 hover:border-amber-300 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center space-x-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Buka Nota</span>
                      </button>
                      <button
                        onClick={() => onDeleteInvoice(inv.id)}
                        className="text-slate-300 hover:text-rose-600 p-1.5 rounded"
                        title="Hapus Nota"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Manual Transaction Modal */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-800">
                {manualType === 'pemasukan' ? 'Catat Pemasukan Kas' : 'Catat Pengeluaran Kas'}
              </h3>
              <button
                onClick={() => setIsManualModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleManualSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => {
                    setManualType('pengeluaran');
                    setManualCategory(KATEGORI_PENGELUARAN[0]);
                  }}
                  className={`py-1.5 rounded-lg font-bold transition ${
                    manualType === 'pengeluaran' ? 'bg-rose-600 text-white' : 'text-slate-600'
                  }`}
                >
                  Pengeluaran (Kas Keluar)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setManualType('pemasukan');
                    setManualCategory(KATEGORI_PEMASUKAN[0]);
                  }}
                  className={`py-1.5 rounded-lg font-bold transition ${
                    manualType === 'pemasukan' ? 'bg-emerald-600 text-white' : 'text-slate-600'
                  }`}
                >
                  Pemasukan (Kas Masuk)
                </button>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Nominal (Rp) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={manualAmount}
                  onChange={(e) => setManualAmount(e.target.value)}
                  placeholder="Contoh: 150000"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono text-sm"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Kategori</label>
                <select
                  value={manualCategory}
                  onChange={(e) => setManualCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white"
                >
                  {(manualType === 'pengeluaran' ? KATEGORI_PENGELUARAN : KATEGORI_PEMASUKAN).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Keterangan Transaksi</label>
                <input
                  type="text"
                  value={manualDesc}
                  onChange={(e) => setManualDesc(e.target.value)}
                  placeholder="Contoh: Beli jagung giling 1 sak 50 kg"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Pihak / Supplier / Toko</label>
                  <input
                    type="text"
                    value={manualCustomer}
                    onChange={(e) => setManualCustomer(e.target.value)}
                    placeholder="Nama pihak terkait"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Metode Bayar</label>
                  <select
                    value={manualMethod}
                    onChange={(e) => setManualMethod(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white"
                  >
                    <option value="Tunai">Tunai</option>
                    <option value="Transfer Bank">Transfer Bank</option>
                    <option value="QRIS">QRIS</option>
                    <option value="Tempo">Tempo</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsManualModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2 rounded-xl transition"
                >
                  Simpan Transaksi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EggCashbookSection;
