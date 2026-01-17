<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @property string $id
 * @property string $category_id
 * @property string $intitule
 * @property string $type_contrat
 * @property string $type_offre
 * @property string $duree
 * @property float $salaire
 * @property string $description
 * @property string $date_cloture
 * @property string $created_at
 * @property string $updated_at
 * @property Candidature[] $candidatures
 * @property Category $category
 */
class Offre extends BaseModel
{
    
    /**
     * @var array
     */
    protected $fillable = ['category_id', 'intitule', 'localisation', 'type_contrat', 'type_offre', 'duree', 'salaire', 'description', 'image', 'date_cloture', 'created_at', 'updated_at'];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function candidatures()
    {
        return $this->hasMany(Candidature::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
