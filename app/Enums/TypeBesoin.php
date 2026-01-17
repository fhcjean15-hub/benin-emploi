<?php

namespace App\Enums;

enum TypeBesoin: string
{
    case recrutement = 'recrutement';
    case formation_professionnel = 'formation_professionnel';
    case gestion_rh = 'gestion_rh';
    case communication_accompagnement = 'communication_accompagnement';
    case autre_service = 'autre_service';
}
