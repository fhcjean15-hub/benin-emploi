<?php

namespace App\Models;
use App\Enums\TypeBesoin;

/**
 * @property string $id
 * @property string $nom_entreprise
 * @property string $email
 * @property string $numero
 * @property string $titre_besoin
 * @property string $description
 * @property mixed $images
 * @property string $created_at
 * @property string $updated_at
 */
class Besoin extends BaseModel
{
    /**
     * @var array
     */

    protected $fillable = [
        'nom_entreprise',
        'email',
        'numero',
        'personne_contact',
        'type_besoin',
        'description',
        'grille_tarifaire',
        'images',
    ];

    protected $casts = [
        'images' => 'array',
    ];
}
