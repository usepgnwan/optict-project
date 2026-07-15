<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('affiliates', function (Blueprint $table) {
            $table->string('phone')->nullable()->after('referral_code');
            $table->string('city')->nullable()->after('phone');
            $table->integer('age')->nullable()->after('city');
            $table->json('promotional_media')->nullable()->after('age');
            $table->string('promotional_link')->nullable()->after('promotional_media');
        });
    }

    public function down(): void
    {
        Schema::table('affiliates', function (Blueprint $table) {
            $table->dropColumn(['phone', 'city', 'age', 'promotional_media', 'promotional_link']);
        });
    }
};
