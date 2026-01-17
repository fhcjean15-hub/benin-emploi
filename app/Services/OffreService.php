<?php

namespace App\Services;

use App\Models\Offre;

class OffreService
{
    public function create(array $data): Offre
    {
        return Offre::create($data);
    }

    public function update(Offre $offre, array $data): Offre
    {
        $offre->update($data);
        return $offre;
    }

    public function delete(Offre $offre): void
    {
        $offre->delete();
    }
}
