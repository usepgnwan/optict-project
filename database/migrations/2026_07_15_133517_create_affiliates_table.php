<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Insert new role
        DB::table('roles')->insert([
            'name' => 'affiliator',
            'display_name' => 'Affiliator',
            'description' => 'Affiliate member',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        Schema::create('affiliates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('referral_code')->unique();
            $table->decimal('commission_rate', 5, 2)->default(0);
            $table->decimal('balance', 15, 2)->default(0);
            $table->string('status')->default('pending'); // pending, active, suspended
            $table->string('bank_name')->nullable();
            $table->string('bank_account_number')->nullable();
            $table->string('bank_account_name')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('affiliates');
        
        DB::table('roles')->where('name', 'affiliator')->delete();
    }
};
