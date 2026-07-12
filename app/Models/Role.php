<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Role extends Model
{
    public const SUPER_ADMIN = 'super_admin';
    public const WAREHOUSE_ADMIN = 'warehouse_admin';
    public const BRANCH_ADMIN = 'branch_admin';
    public const MANAGER = 'manager';

    protected $fillable = ['name', 'display_name', 'description'];

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public static function getAllRoleNames(): array
    {
        return [
            self::SUPER_ADMIN,
            self::WAREHOUSE_ADMIN,
            self::BRANCH_ADMIN,
            self::MANAGER,
        ];
    }
}
