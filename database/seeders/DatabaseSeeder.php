<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ─── 1. Roles ──────────────────────────────────────────────
        $superAdmin = Role::create([
            'name' => Role::SUPER_ADMIN,
            'display_name' => 'Super Admin',
            'description' => 'Full access to all features',
        ]);

        $warehouseAdmin = Role::create([
            'name' => Role::WAREHOUSE_ADMIN,
            'display_name' => 'Warehouse Admin',
            'description' => 'Manage central warehouse and transfer stock',
        ]);

        $branchAdmin = Role::create([
            'name' => Role::BRANCH_ADMIN,
            'display_name' => 'Branch Admin',
            'description' => 'Manage branch inventory, receive transfers, perform stock opname',
        ]);

        $manager = Role::create([
            'name' => Role::MANAGER,
            'display_name' => 'Manager',
            'description' => 'Read reports and approve transfers',
        ]);

        // ─── 2. Branches ───────────────────────────────────────────
        $branches = [
            [
                'name' => 'Optik Calm Jakarta Pusat',
                'city' => 'Jakarta',
                'address' => 'Jl. MH Thamrin No. 15, Menteng, Jakarta Pusat 10350',
                'phone' => '081199988801',
                'email' => 'jakarta@optikcalm.com',
            ],
            [
                'name' => 'Optik Calm Bandung',
                'city' => 'Bandung',
                'address' => 'Jl. Braga No. 88, Sumur Bandung, Bandung 40111',
                'phone' => '081199988802',
                'email' => 'bandung@optikcalm.com',
            ],
            [
                'name' => 'Optik Calm Surabaya',
                'city' => 'Surabaya',
                'address' => 'Jl. Tunjungan No. 42, Genteng, Surabaya 60275',
                'phone' => '081199988803',
                'email' => 'surabaya@optikcalm.com',
            ],
            [
                'name' => 'Optik Calm Medan',
                'city' => 'Medan',
                'address' => 'Jl. Diponegoro No. 25, Medan Petisah 20152',
                'phone' => '081199988804',
                'email' => 'medan@optikcalm.com',
            ],
        ];

        $createdBranches = [];
        foreach ($branches as $branchData) {
            $createdBranches[] = Branch::create($branchData);
        }

        // ─── 3. Users ──────────────────────────────────────────────
        // Super Admin
        User::create([
            'name' => 'Admin Optik Calm',
            'email' => 'admin@optikcalm.com',
            'password' => Hash::make('password'),
            'role_id' => $superAdmin->id,
            'email_verified_at' => now(),
        ]);

        // Warehouse Admin
        User::create([
            'name' => 'Budi Warehouse',
            'email' => 'warehouse@optikcalm.com',
            'password' => Hash::make('password'),
            'role_id' => $warehouseAdmin->id,
            'email_verified_at' => now(),
        ]);

        // Branch Admins
        foreach ($createdBranches as $index => $branch) {
            $names = ['Rina Jakarta', 'Doni Bandung', 'Sari Surabaya', 'Eko Medan'];
            $emails = ['jakarta.admin@optikcalm.com', 'bandung.admin@optikcalm.com', 'surabaya.admin@optikcalm.com', 'medan.admin@optikcalm.com'];
            User::create([
                'name' => $names[$index],
                'email' => $emails[$index],
                'password' => Hash::make('password'),
                'role_id' => $branchAdmin->id,
                'branch_id' => $branch->id,
                'email_verified_at' => now(),
            ]);
        }

        // Manager
        User::create([
            'name' => 'Manager Optik',
            'email' => 'manager@optikcalm.com',
            'password' => Hash::make('password'),
            'role_id' => $manager->id,
            'email_verified_at' => now(),
        ]);
    }
}
