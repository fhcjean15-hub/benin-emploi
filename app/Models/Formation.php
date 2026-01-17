<?php

namespace App\Models;

class Formation extends BaseModel
{
    protected $fillable = [
        'titre',
        'description',
        'duree',
        'date_debut',
        'images',
        'cout',
    ];

    protected $casts = [
        'images' => 'array',
        'date_debut' => 'date',
        'cout' => 'decimal:2',
    ];

    public function usersFormations()
    {
        return $this->hasMany(UsersFormation::class);
    }
}
