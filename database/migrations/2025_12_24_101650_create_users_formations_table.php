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
        Schema::create('users_formations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('formation_id')->constrained()->cascadeOnDelete();

            $table->string('nom');
            $table->string('prenom');
            $table->string('contact');
            $table->string('email');

            $table->string('reference')->unique();
            $table->decimal('montant', 10, 2);
            $table->enum('status', ['en_attente', 'paye', 'annule'])->default('en_attente');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users_formations');
    }
};
