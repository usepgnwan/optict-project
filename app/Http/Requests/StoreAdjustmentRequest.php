<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAdjustmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'location_type' => 'required|string|in:central,branch',
            'branch_id' => 'required_if:location_type,branch|nullable|exists:branches,id',
            'product_id' => 'required|exists:products,id',
            'reason' => 'required|string|in:lost,broken,damaged,stock_opname,other',
            'adjustment_qty' => 'required|integer|not_in:0',
            'notes' => 'nullable|string|max:1000',
        ];
    }

    public function messages(): array
    {
        return [
            'product_id.required' => 'Produk wajib dipilih.',
            'reason.required' => 'Alasan penyesuaian wajib dipilih.',
            'adjustment_qty.required' => 'Jumlah penyesuaian wajib diisi.',
            'adjustment_qty.not_in' => 'Jumlah penyesuaian tidak boleh 0.',
        ];
    }
}
