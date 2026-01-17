<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @property string $id
 * @property string $titre
 * @property string $created_at
 * @property string $updated_at
 * @property Offre[] $offres
 */
class Category extends BaseModel
{
    /**
     * @var array
     */
    protected $fillable = ['titre', 'created_at', 'updated_at'];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function offres()
    {
        return $this->hasMany(Offre::class);
    }
}


