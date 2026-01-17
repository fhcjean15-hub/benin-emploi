<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @property string $id
 * @property string $user_id
 * @property string $formation_id
 * @property string $nom
 * @property string $prenom
 * @property string $contact
 * @property string $email
 * @property string $reference
 * @property float $montant
 * @property string $status
 * @property string $created_at
 * @property string $updated_at
 * @property Formation $formation
 * @property User $user
 */
class UsersFormation extends BaseModel
{

    /**
     * @var array
     */
    protected $fillable = ['user_id', 'formation_id', 'nom', 'prenom', 'contact', 'email', 'reference', 'montant', 'status', 'created_at', 'updated_at'];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function formation()
    {
        return $this->belongsTo(Formation::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
