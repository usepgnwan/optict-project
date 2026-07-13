<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('discounts', function (Blueprint $table) {
            $table->id();
            $table->string('code')->nullable()->unique();
            $table->string('name');
            $table->string('type', 30); // percentage, fixed_amount, promotion, member_discount, voucher
            $table->decimal('value', 15, 2)->default(0);
            $table->string('apply_to', 30)->default('entire_invoice'); // entire_invoice, specific_item
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('cashiers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('branch_id')->constrained('branches')->cascadeOnDelete();
            $table->string('cashier_code')->unique();
            $table->string('name');
            $table->string('status', 20)->default('active');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cashiers');
        Schema::dropIfExists('discounts');
    }
};
