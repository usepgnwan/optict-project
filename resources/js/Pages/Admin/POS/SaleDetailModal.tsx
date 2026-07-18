import React from 'react';
import Modal from '@/Components/Modal';

interface SaleDetailModalProps {
    show: boolean;
    onClose: () => void;
    sale: any | null;
}

export default function SaleDetailModal({ show, onClose, sale }: SaleDetailModalProps) {
    if (!sale) return null;

    const formatRupiah = (val: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(val || 0);
    };

    const calculateItemCommission = (item: any) => {
        const productOrService = item.item_type === 'product' ? item.product : item.service;
        if (!productOrService) return 0;

        const type = productOrService.commission_type;
        const amount = Number(productOrService.commission_amount) || 0;

        if (type === 'percentage') {
            return (Number(item.subtotal) * amount) / 100;
        } else if (type === 'fixed') {
            return amount * item.qty;
        }

        return 0;
    };

    const totalCommission = sale.items?.reduce((sum: number, item: any) => sum + calculateItemCommission(item), 0) || 0;

    return (
        <Modal show={show} onClose={onClose} maxWidth="2xl">
            <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-lg font-black text-on-surface">Detail Transaksi POS</h2>
                        <p className="text-sm text-on-surface-variant font-medium">Invoice: <span className="font-bold text-primary">{sale.invoice_number}</span></p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-surface-variant text-on-surface-variant transition-colors cursor-pointer"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* General Info */}
                    <div className="bg-surface-variant/30 p-4 rounded-xl border border-outline-variant">
                        <h4 className="font-bold text-sm mb-3 flex items-center gap-2 text-on-surface">
                            <span className="material-symbols-outlined text-[18px] text-primary">person</span>
                            Informasi Pelanggan
                        </h4>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-on-surface-variant">Nama:</span>
                                <span className="font-semibold text-on-surface">{sale.walkin_name || sale.customer?.full_name || 'Walk-in'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-on-surface-variant">Telepon:</span>
                                <span className="font-semibold text-on-surface">{sale.walkin_phone || sale.customer?.phone_number || '-'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-on-surface-variant">Cabang:</span>
                                <span className="font-semibold text-on-surface">{sale.branch?.name || '-'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-on-surface-variant">Tanggal:</span>
                                <span className="font-semibold text-on-surface">{new Date(sale.created_at).toLocaleString('id-ID')}</span>
                            </div>
                        </div>
                    </div>

                    {/* Affiliator Info */}
                    <div className="bg-surface-variant/30 p-4 rounded-xl border border-outline-variant">
                        <h4 className="font-bold text-sm mb-3 flex items-center gap-2 text-on-surface">
                            <span className="material-symbols-outlined text-[18px] text-primary">group</span>
                            Informasi Affiliator
                        </h4>
                        {sale.affiliate ? (
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-on-surface-variant">Nama:</span>
                                    <span className="font-semibold text-on-surface">{sale.affiliate.user?.full_name || '-'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-on-surface-variant">Kode Referral:</span>
                                    <span className="font-bold text-primary">{sale.affiliate.referral_code}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-on-surface-variant">Nomor HP:</span>
                                    <span className="font-semibold text-on-surface">{sale.affiliate.phone || '-'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-on-surface-variant">Total Komisi Transaksi:</span>
                                    <span className="font-black text-emerald-600 dark:text-emerald-400">{formatRupiah(totalCommission)}</span>
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-on-surface-variant py-4 text-center italic">Tidak ada affiliator yang terkait dengan transaksi ini.</p>
                        )}
                    </div>
                </div>

                {/* Payment Status */}
                <div className="mb-6">
                    <h4 className="font-bold text-sm mb-3 flex items-center gap-2 text-on-surface">
                        <span className="material-symbols-outlined text-[18px] text-primary">payments</span>
                        Status Pembayaran
                    </h4>
                    <div className="bg-surface-variant/30 p-4 rounded-xl border border-outline-variant flex flex-col md:flex-row justify-between items-center gap-4">
                        <div>
                            <span className={`px-3 py-1 text-xs font-bold rounded-full ${sale.status === 'completed' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400'}`}>
                                {sale.status === 'completed' ? 'LUNAS (Completed)' : sale.status.toUpperCase()}
                            </span>
                        </div>
                        <div className="flex gap-6 text-sm">
                            <div className="text-center">
                                <p className="text-on-surface-variant text-xs">Total Tagihan</p>
                                <p className="font-black text-on-surface">{formatRupiah(Number(sale.grand_total))}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-on-surface-variant text-xs">Total Dibayar</p>
                                <p className="font-black text-emerald-600 dark:text-emerald-400">{formatRupiah(Number(sale.paid_amount))}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-on-surface-variant text-xs">Kembalian</p>
                                <p className="font-bold text-on-surface">{formatRupiah(Number(sale.change_amount))}</p>
                            </div>
                        </div>
                    </div>
                    {sale.payments && sale.payments.length > 0 && (
                        <div className="mt-3">
                            <p className="text-xs font-bold text-on-surface-variant mb-2">Metode Pembayaran:</p>
                            <div className="flex flex-wrap gap-2">
                                {sale.payments.map((payment: any, idx: number) => (
                                    <span key={idx} className="bg-surface border border-outline-variant px-3 py-1 rounded-lg text-xs font-semibold text-on-surface shadow-xs">
                                        {payment.payment_method_name} - {formatRupiah(Number(payment.amount))}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Commission Details */}
                {sale.affiliate && (
                    <div>
                        <h4 className="font-bold text-sm mb-3 flex items-center gap-2 text-on-surface">
                            <span className="material-symbols-outlined text-[18px] text-primary">percent</span>
                            Detail Komisi Pembelian Kacamata & Layanan
                        </h4>
                        <div className="overflow-x-auto border border-outline-variant rounded-xl">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-surface-variant/40 border-b border-outline-variant text-[11px] uppercase tracking-wider">
                                    <tr>
                                        <th className="p-3">Nama Item</th>
                                        <th className="p-3 text-center">Qty</th>
                                        <th className="p-3 text-right">Subtotal</th>
                                        <th className="p-3 text-center">Tipe Komisi</th>
                                        <th className="p-3 text-right">Komisi Item</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-outline-variant/60">
                                    {sale.items?.map((item: any, idx: number) => {
                                        const productOrService = item.item_type === 'product' ? item.product : item.service;
                                        const commissionType = productOrService?.commission_type;
                                        const commissionAmount = productOrService?.commission_amount;
                                        const itemCommission = calculateItemCommission(item);

                                        return (
                                            <tr key={idx} className="hover:bg-surface-variant/20">
                                                <td className="p-3">
                                                    <span className="font-semibold text-on-surface block">{item.item_name}</span>
                                                    <span className="text-[10px] text-on-surface-variant capitalize">{item.item_type}</span>
                                                </td>
                                                <td className="p-3 text-center font-medium">{item.qty}</td>
                                                <td className="p-3 text-right font-semibold">{formatRupiah(Number(item.subtotal))}</td>
                                                <td className="p-3 text-center text-xs">
                                                    {commissionType ? (
                                                        <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[10px] font-bold">
                                                            {commissionType === 'percentage' ? `${Number(commissionAmount)}%` : 'Fixed'}
                                                        </span>
                                                    ) : (
                                                        <span className="text-on-surface-variant/50">-</span>
                                                    )}
                                                </td>
                                                <td className="p-3 text-right font-black text-emerald-600 dark:text-emerald-400">
                                                    {itemCommission > 0 ? formatRupiah(itemCommission) : '-'}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                                <tfoot className="bg-surface-variant/40 border-t border-outline-variant">
                                    <tr>
                                        <td colSpan={4} className="p-3 text-right font-bold text-on-surface">Total Komisi Affiliator:</td>
                                        <td className="p-3 text-right font-black text-emerald-600 dark:text-emerald-400 text-base">{formatRupiah(totalCommission)}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
}
