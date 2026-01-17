<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Enums\CandidatureStatus;

/**
 * @property string $id
 * @property string $user_id
 * @property string $offre_id
 * @property string $date_candidature
 * @property string $status
 * @property string $lettre_motivation
 * @property string $created_at
 * @property string $updated_at
 * @property Offre $offre
 * @property User $user
 */
class Candidature extends BaseModel
{
    /**
     * @var array
     */
    protected $fillable = ['user_id', 'offre_id', 'lettre_motivation', 'created_at', 'updated_at'];
    
    protected $casts = [
        'date_candidature' => 'date',
        'status' => CandidatureStatus::class, // cast automatique vers Enum
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function offre()
    {
        return $this->belongsTo(Offre::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

}
