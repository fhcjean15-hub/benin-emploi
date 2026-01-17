<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Carbon;

class OffreResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'intitule' => $this->intitule,
            'localisation' => $this->localisation,
            'type_contrat' => $this->type_contrat,
            'type_offre' => $this->type_offre,
            'duree' => $this->duree,
            'salaire' => $this->salaire,
            'description' => $this->description,
            'date_cloture' => Carbon::parse($this->date_cloture)->format('Y-m-d'),
            'image' => $this->image,
            'category' => [
                'id' => $this->category->id,
                'titre' => $this->category->titre,
            ],

            'created_at' => $this->created_at?->toDateTimeString(),
        ];
    }
}
