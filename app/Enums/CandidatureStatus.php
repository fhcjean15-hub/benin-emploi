<?php

namespace App\Enums;

enum CandidatureStatus: string
{
    case EN_ATTENTE = 'en_attente';
    case ACCEPTE = 'accepte';
    case REJETE = 'rejete';

    public static function values(): array
    {
        return array_map(fn($status) => $status->value, self::cases());
    }
}
