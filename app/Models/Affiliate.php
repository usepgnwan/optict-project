<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Affiliate extends Model
{
    protected $fillable = [
        'user_id',
        'referral_code',
        'phone',
        'city',
        'age',
        'promotional_media',
        'promotional_link',
        'commission_rate',
        'balance',
        'status',
        'bank_name',
        'bank_account_number',
        'bank_account_name',
    ];

    protected function casts(): array
    {
        return [
            'promotional_media' => 'array',
        ];
    }

    public function user(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function sales(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Sale::class, 'affiliate_code', 'referral_code');
    }

    public function clicks(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(AffiliateClick::class);
    }
}
