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
        Schema::create('offres', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('intitule');
            $table->foreignUuid('category_id')->constrained('categories')->cascadeOnDelete();
            //enum type_contrat: CDD, CDI, Stage, alternance
            $table->enum('type_contrat', ['CDD', 'CDI', 'Stage', 'Alternance']); 
            //enum type_offre: emploi, stage
            $table->enum('type_offre', ['emploi', 'stage']);   // emploi, stage
            $table->string('duree')->nullable();
            $table->decimal('salaire', 10, 2)->nullable();
            $table->text('description');
            $table->date('date_cloture');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('offres');
    }
};
