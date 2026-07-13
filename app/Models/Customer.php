<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Customer extends Model
{
    protected $fillable = [
        'customer_code',
        'full_name',
        'phone_number',
        'email',
        'address',
        'date_of_birth',
        'gender',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'date_of_birth' => 'date',
        ];
    }

    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class);
    }

    public function sales(): HasMany
    {
        return $this->hasMany(Sale::class);
    }
}
