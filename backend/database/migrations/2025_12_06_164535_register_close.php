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
        Schema::create('register_close', function (Blueprint $table){
            $table->id();
            $table->date('date');
            $table->decimal('final_amount', 12, 2);
            $table->decimal('COP_amount', 10, 2);
            $table->decimal('USD_amount', 10, 2);
            $table->decimal('VES_amount', 10, 2);
            $table->text('description')->nullable(true);

            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')->references('id')->on('users');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('register_close');
    }
};
