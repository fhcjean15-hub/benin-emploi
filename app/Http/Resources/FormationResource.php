<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class FormationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'titre' => $this->titre,
            'description' => $this->description,
            'duree' => $this->duree,
            'date_debut' => $this->date_debut?->format('Y-m-d'),
            'cout' => $this->cout,
            'images' => $this->images,
            'created_at' => $this->created_at?->toDateTimeString(),
        ];
    }
}
