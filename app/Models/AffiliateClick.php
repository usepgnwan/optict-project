<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AffiliateClick extends Model
{
    const UPDATED_AT = null;

    protected $fillable = [
        'affiliate_id',
        'ip_address',
        'user_agent',
        'landing_page',
    ];

    public function affiliate()
    {
        return $this->belongsTo(Affiliate::class);
    }
}
