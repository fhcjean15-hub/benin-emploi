<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UsersFormationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nom' => $this->nom,
            'prenom' => $this->prenom,
            'contact' => $this->contact,
            'email' => $this->email,
            'reference' => $this->reference,
            'montant' => $this->montant,
            'status' => $this->status,
            'formation' => [
                'id' => $this->formation->id,
                'titre' => $this->formation->titre,
                'date_debut' => $this->formation->date_debut?->format('Y-m-d'),
                'images' => $this->formation->images,
                'cout' => $this->formation->cout,
            ],
            'created_at' => $this->created_at?->toDateTimeString(),
        ];
    }
}
