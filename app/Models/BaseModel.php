<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class BaseModel extends Model
{
    /**
     * Indique que le modèle utilise des UUIDs
     */
    public $incrementing = false;

    /**
     * Le type de la clé primaire
     */
    protected $keyType = 'string';

    /**
     * Générer automatiquement un UUID avant la création
     */
    public static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (!$model->getKey()) {
                $model->{$model->getKeyName()} = Str::uuid();
            }
        });
    }

    /**
     * Retourner un UUID
     */
    public static function generateUuid()
    {
        return Str::uuid()->toString();
    }
}
