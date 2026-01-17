<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @property string $id
 * @property string $titre
 * @property string $contenu
 * @property mixed $image
 * @property string $created_at
 * @property string $updated_at
 */
class Blog extends BaseModel
{

    /**
     * @var array
     */
    protected $fillable = ['titre', 'contenu', 'image', 'created_at', 'updated_at'];

    // Cast pour que 'image' soit automatiquement un tableau
    protected $casts = [
        'image' => 'array',
    ];
}
