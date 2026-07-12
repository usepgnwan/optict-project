<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stock_movements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
            $table->string('location_type', 20); // central, branch
            $table->foreignId('branch_id')->nullable()->constrained('branches')->nullOnDelete();
            $table->string('movement_type', 30); // transfer_in, transfer_out, adjustment, opname, initial
            $table->string('reference_type')->nullable(); // App\Models\StockTransfer, etc.
            $table->unsignedBigInteger('reference_id')->nullable();
            $table->integer('quantity_before');
            $table->integer('quantity_change'); // positive = in, negative = out
            $table->integer('quantity_after');
            $table->text('notes')->nullable();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->timestamps();

            $table->index('product_id');
            $table->index(['location_type', 'branch_id']);
            $table->index('movement_type');
            $table->index('created_at');
            $table->index(['reference_type', 'reference_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stock_movements');
    }
};
