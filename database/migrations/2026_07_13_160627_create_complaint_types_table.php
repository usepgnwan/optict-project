<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('complaint_types', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        // Insert initial complaint types
        \Illuminate\Support\Facades\DB::table('complaint_types')->insert([
            [
                'name' => 'Mata Lelah / Sakit Kepala',
                'description' => 'Gejala ketegangan mata akibat penggunaan layar digital atau aktivitas dekat',
                'is_active' => true,
                'sort_order' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Pandangan Buram Jarak Jauh',
                'description' => 'Kesulitan melihat objek pada jarak jauh (kemungkinan miopia / rabun jauh)',
                'is_active' => true,
                'sort_order' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Kesulitan Membaca (Jarak Dekat)',
                'description' => 'Keluhan membaca teks dekat atau penglihatan jarak dekat (kemungkinan presbiopia)',
                'is_active' => true,
                'sort_order' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Pemeriksaan Rutin / Ganti Lensa',
                'description' => 'Pemeriksaan mata berkala atau penggantian ukuran lensa kacamata',
                'is_active' => true,
                'sort_order' => 4,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Konsultasi Frame Kacamata',
                'description' => 'Pemilihan frame kacamata yang sesuai bentuk wajah dan kenyamanan',
                'is_active' => true,
                'sort_order' => 5,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Lainnya',
                'description' => 'Kebutuhan atau konsultasi optikal lainnya',
                'is_active' => true,
                'sort_order' => 6,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('complaint_types');
    }
};
