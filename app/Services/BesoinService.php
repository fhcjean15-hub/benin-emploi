<?php

namespace App\Services;

use App\Models\Besoin;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class BesoinService
{
    public function create(array $data): Besoin
    {
        $user = Auth::user();

        // Gérer les images si présentes
        if (isset($data['images'])) {
            $uploadedImages = [];
            foreach ($data['images'] as $image) {
                $uploadedImages[] = $image->store('besoin', 'public');
            }
            $data['images'] = $uploadedImages; // stocké en JSON
        }

        return Besoin::create($data);
    }

    public function update(Besoin $besoin, array $data): Besoin
    {
        // Gérer les nouvelles images
        //ne sera certainement pas necessaire
        if (isset($data['images'])) {
            $uploadedImages = [];
            foreach ($data['images'] as $image) {
                $uploadedImages[] = $image->store('besoin', 'public');
            }
            $data['images'] = $uploadedImages;
        }

        $besoin->update($data);

        return $besoin;
    }

    public function delete(Besoin $besoin): void
    {
        // Supprimer les images stockées
        if ($besoin->images) {
            foreach ($besoin->images as $img) {
                if (Storage::disk('public')->exists($img)) {
                    Storage::disk('public')->delete($img);
                }
            }
        }

        $besoin->delete();
    }
}
