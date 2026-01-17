<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CandidatureResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'offre' => [
                'id' => $this->offre->id,
                'intitule' => $this->offre->intitule,
                'localisation' => $this->offre->localisation,
            ],
            'status' => $this->status?->value ?? 'en_attente',
            'lettre_motivation' => $this->lettre_motivation,
            'created_at' => $this->created_at?->toDateTimeString(),

            // Inclure les infos de l'utilisateur
            'user' => $this->user
        ];
    }
}
