<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class MarketingKit extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'image_path',
        'video_url',
        'description',
        'is_active',
    ];
}
