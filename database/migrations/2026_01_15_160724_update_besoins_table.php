<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('besoins', function (Blueprint $table) {

            // Renommer le champ
            $table->renameColumn('titre_besoin', 'type_besoin');

            // Nouveaux champs
            $table->string('personne_contact')->after('numero');
            $table->string('grille_tarifaire')->after('description');
        });
    }

    public function down(): void
    {
        Schema::table('besoins', function (Blueprint $table) {

            $table->renameColumn('type_besoin', 'titre_besoin');
            $table->dropColumn(['personne_contact', 'grille_tarifaire']);
        });
    }
};

