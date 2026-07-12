<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTransferRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'source_type' => 'required|string|in:central,branch',
            'source_branch_id' => 'required_if:source_type,branch|nullable|exists:branches,id',
            'destination_type' => 'required|string|in:central,branch',
            'destination_branch_id' => 'required_if:destination_type,branch|nullable|exists:branches,id',
            'notes' => 'nullable|string|max:1000',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ];
    }

    public function messages(): array
    {
        return [
            'items.required' => 'Minimal harus ada 1 item produk.',
            'items.min' => 'Minimal harus ada 1 item produk.',
            'items.*.product_id.required' => 'Produk wajib dipilih.',
            'items.*.quantity.required' => 'Jumlah wajib diisi.',
            'items.*.quantity.min' => 'Jumlah minimal 1.',
        ];
    }
}
