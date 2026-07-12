<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role_id',
        'branch_id',
        'is_active',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
        ];
    }

    // ─── Relationships ───────────────────────────────────────

    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    // ─── Role Helpers ────────────────────────────────────────

    public function isSuperAdmin(): bool
    {
        return $this->role?->name === Role::SUPER_ADMIN;
    }

    public function isWarehouseAdmin(): bool
    {
        return $this->role?->name === Role::WAREHOUSE_ADMIN;
    }

    public function isBranchAdmin(): bool
    {
        return $this->role?->name === Role::BRANCH_ADMIN;
    }

    public function isManager(): bool
    {
        return $this->role?->name === Role::MANAGER;
    }

    public function hasRole(string ...$roles): bool
    {
        return in_array($this->role?->name, $roles);
    }

    public function getRoleDisplayNameAttribute(): string
    {
        return $this->role?->display_name ?? 'No Role';
    }
}
