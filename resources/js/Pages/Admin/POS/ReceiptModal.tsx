import React from 'react';

interface SaleItem {
    id: number;
    item_type: 'service' | 'product';
    item_name: string;
    qty: number;
    unit_price: number;
    discount: number;
    subtotal: number;
}

interface Payment {
    id: number;
    payment_method_name: string;
    amount: number;
    reference_number?: string | null;
}

interface Sale {
    id: number;
    invoice_number: string;
    created_at: string;
    subtotal_products: number;
    subtotal_services: number;
    discount_amount: number;
    tax_amount: number;
    grand_total: number;
    paid_amount: number;
    change_amount: number;
    walkin_name?: string | null;
    walkin_phone?: string | null;
    customer?: {
        full_name: string;
        phone_number: string;
    };
    branch?: {
        name: string;
        address: string;
        phone: string;
    };
    items?: SaleItem[];
    payments?: Payment[];
}

interface ReceiptModalProps {
    show: boolean;
    onClose: () => void;
    sale: Sale | null;
}

export default function ReceiptModal({ show, onClose, sale }: ReceiptModalProps) {
    if (!show || !sale) return null;

    const formatRupiah = (val: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(val);
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <div className="bg-surface w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-outline-variant flex flex-col max-h-[90vh]">
                {/* Modal Toolbar (hidden when printing) */}
                <div className="print:hidden px-6 py-4 bg-surface-variant flex items-center justify-between border-b border-outline-variant">
                    <h3 className="font-bold text-on-surface flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">receipt_long</span>
                        <span>Struk Resmi POS</span>
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-tertiary/40 text-on-surface-variant transition-colors cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-[20px]">close</span>
                    </button>
                </div>

                {/* Printable Thermal Area */}
                <div id="thermal-receipt" className="p-6 overflow-y-auto font-mono text-xs text-on-surface space-y-4 print:p-0 print:text-black print:bg-white">
                    {/* Header */}
                    <div className="text-center border-b border-dashed border-outline-variant pb-4">
                        <div className="flex justify-center mb-2">
                            <img src="/logo.png" alt="Harmoni Logo" className="h-8 w-auto object-contain" />
                        </div>
                        <h2 className="text-base font-black uppercase tracking-wider text-primary print:text-black">
                            HARMONI BY PHOENIX SEHAT
                        </h2>
                        <p className="font-bold">{sale.branch?.name || 'Cabang Harmoni'}</p>
                        <p className="text-[10px] text-on-surface-variant print:text-gray-600">
                            {sale.branch?.address || 'Layanan Kesehatan Mata Premium'}
                        </p>
                        <p className="text-[10px] text-on-surface-variant print:text-gray-600">
                            Telp: {sale.branch?.phone || '021-1234567'}
                        </p>
                    </div>

                    {/* Metadata */}
                    <div className="space-y-1 text-[11px]">
                        <div className="flex justify-between">
                            <span>No. Invoice:</span>
                            <span className="font-bold">{sale.invoice_number}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Waktu:</span>
                            <span>{new Date(sale.created_at).toLocaleString('id-ID')}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Pelanggan:</span>
                            <span className="font-bold">
                                {sale.customer?.full_name || sale.walkin_name || 'Walk-In'}
                            </span>
                        </div>
                        {(sale.customer?.phone_number || sale.walkin_phone) && (
                            <div className="flex justify-between">
                                <span>No. Telepon:</span>
                                <span>{sale.customer?.phone_number || sale.walkin_phone}</span>
                            </div>
                        )}
                    </div>

                    {/* Items Table */}
                    <div className="border-t border-b border-dashed border-outline-variant py-3 space-y-2.5">
                        {sale.items?.map((item) => (
                            <div key={item.id}>
                                <div className="flex justify-between font-bold">
                                    <span>
                                        {item.item_name}{' '}
                                        <span className="text-[10px] font-normal text-on-surface-variant">
                                            ({item.item_type === 'service' ? 'Layanan' : 'Produk'})
                                        </span>
                                    </span>
                                    <span>{formatRupiah(Number(item.subtotal))}</span>
                                </div>
                                <div className="text-[10px] text-on-surface-variant flex justify-between">
                                    <span>
                                        {item.qty} x {formatRupiah(Number(item.unit_price))}
                                    </span>
                                    {Number(item.discount) > 0 && (
                                        <span className="text-rose-500">
                                            Diskon: -{formatRupiah(Number(item.discount))}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Summary */}
                    <div className="space-y-1 text-[11px]">
                        <div className="flex justify-between">
                            <span>Subtotal Layanan:</span>
                            <span>{formatRupiah(Number(sale.subtotal_services))}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Subtotal Produk:</span>
                            <span>{formatRupiah(Number(sale.subtotal_products))}</span>
                        </div>
                        {Number(sale.discount_amount) > 0 && (
                            <div className="flex justify-between text-rose-500">
                                <span>Total Diskon:</span>
                                <span>-{formatRupiah(Number(sale.discount_amount))}</span>
                            </div>
                        )}
                        <div className="flex justify-between font-black text-sm pt-2 border-t border-outline-variant">
                            <span>GRAND TOTAL:</span>
                            <span>{formatRupiah(Number(sale.grand_total))}</span>
                        </div>
                    </div>

                    {/* Multi-Payment Details */}
                    <div className="border-t border-dashed border-outline-variant pt-3 space-y-1 text-[11px]">
                        <p className="font-bold uppercase tracking-wider text-[10px]">Metode Pembayaran:</p>
                        {sale.payments?.map((p) => (
                            <div key={p.id} className="flex justify-between">
                                <span>• {p.payment_method_name}</span>
                                <span className="font-bold">{formatRupiah(Number(p.amount))}</span>
                            </div>
                        ))}
                        <div className="flex justify-between font-bold pt-1 border-t border-outline-variant">
                            <span>KEMBALIAN:</span>
                            <span className="text-emerald-600 print:text-black">
                                {formatRupiah(Number(sale.change_amount))}
                            </span>
                        </div>
                    </div>

                    {/* Footer note */}
                    <div className="text-center pt-4 border-t border-dashed border-outline-variant text-[10px] text-on-surface-variant print:text-gray-600">
                        <p className="font-bold">TERIMA KASIH ATAS KUNJUNGAN ANDA</p>
                        <p>Kenyamanan penglihatan Anda adalah prioritas kami.</p>
                    </div>
                </div>

                {/* Print Buttons Footer */}
                <div className="print:hidden p-5 bg-surface-variant/60 border-t border-outline-variant flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2.5 rounded-xl border border-outline-variant text-sm font-semibold hover:bg-tertiary/40 transition-colors cursor-pointer"
                    >
                        Tutup
                    </button>
                    <button
                        type="button"
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-on-primary text-sm font-bold shadow-md shadow-primary/20 hover:bg-primary/90 transition-all cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-[18px]">print</span>
                        <span>Cetak Struk Thermal</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
