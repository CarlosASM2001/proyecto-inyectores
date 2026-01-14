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
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            //Los check para almacenar los valores de tipo y estado se haran a nivel de aplicacion
            $table->string('type', 100);
            $table->string('status', 100);
            $table->decimal('total_value', 10, 2);

            $table->timestamps();

            $table->unsignedBigInteger('client_id');
            $table->unsignedBigInteger('user_id');
            $table->foreign('client_id')->references('id')->on('clients')->onUpdate('cascade')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onUpdate('cascade')->onDelete('cascade');
            $table->unsignedBigInteger('register_close_id')->nullable(true);
            $table->foreign('register_close_id')->references('id')->on('register_close')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
