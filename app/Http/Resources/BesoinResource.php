<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class BesoinResource extends JsonResource
{
    public static function grilleTarifaireLabels(): array
    {
        return [
            'emploi_1_jour' => 'Facebook + WhatsApp – 1 000 FCFA / jour',
            'emploi_7_jours' => 'Facebook + WhatsApp + Telegram – 6 000 FCFA / 7 jours',
            'emploi_mois' => 'Facebook + WhatsApp + Telegram + LinkedIn – 20 000 FCFA / mois',

            'formation_1_jour' => 'Facebook + WhatsApp – 2 000 FCFA / jour',
            'formation_7_jours' => 'Facebook + WhatsApp + Telegram – 10 000 FCFA / 7 jours',
            'formation_mois' => 'Facebook + WhatsApp + Telegram + LinkedIn – 40 000 FCFA / mois',
        ];
    }


    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'nom_entreprise' => $this->nom_entreprise,
            'personne_contact' =>$this->personne_contact,
            'email' => $this->email,
            'numero' => $this->numero,
            'type_besoin' => $this->type_besoin,
            'description' => $this->description,
            'grille_tarifaire' => $this->grille_tarifaire,
            'images' => $this->images,
            'created_at' => $this->created_at?->toDateTimeString(),
        ];
    }
}
