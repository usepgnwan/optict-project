<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOpnameRequest extends FormRequest
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
            'notes' => 'nullable|string|max:1000',
        ];
    }
}
