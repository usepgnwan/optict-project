<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $productId = $this->route('product')?->id;

        return [
            'sku' => [
                'required',
                'string',
                'max:50',
                Rule::unique('products', 'sku')->ignore($productId),
            ],
            'barcode' => [
                'nullable',
                'string',
                'max:100',
                Rule::unique('products', 'barcode')->ignore($productId),
            ],
            'name' => 'required|string|max:255',
            'brand' => 'required|string|max:100',
            'category' => 'required|string|in:frame,lens,accessory,package',
            'frame_type' => 'nullable|string|in:full_frame,half_frame,rimless',
            'frame_color' => 'nullable|string|max:100',
            'lens_type' => 'nullable|string|in:single_vision,bifocal,progressive,photochromic',
            'selling_price' => 'required|numeric|min:0',
            'cost_price' => 'required|numeric|min:0',
            'description' => 'nullable|string|max:2000',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:3072',
            'is_active' => 'boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'sku.required' => 'SKU wajib diisi.',
            'sku.unique' => 'SKU sudah digunakan.',
            'barcode.required' => 'Barcode wajib diisi.',
            'barcode.unique' => 'Barcode sudah digunakan.',
            'name.required' => 'Nama produk wajib diisi.',
            'brand.required' => 'Brand wajib diisi.',
            'category.required' => 'Kategori wajib dipilih.',
            'selling_price.required' => 'Harga jual wajib diisi.',
            'cost_price.required' => 'Harga modal wajib diisi.',
            'image.uploaded' => 'Foto gagal diunggah karena ukuran file melebihi batas upload server.',
            'image.image' => 'File harus berupa gambar.',
            'image.mimes' => 'Format foto harus jpg, jpeg, png, atau webp.',
            'image.max' => 'Ukuran foto maksimal adalah 3 MB.',
        ];
    }
}
