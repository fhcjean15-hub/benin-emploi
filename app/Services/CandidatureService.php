<?php

namespace App\Services;

use App\Models\Candidature;
use App\Enums\CandidatureStatus;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class CandidatureService
{
    public function postuler(Request $request, array $data): Candidature
    {
        $user = $request->user();

        // Ajouter user_id et status à la candidature
        $data['user_id'] = $user->id;
        $data['status'] = CandidatureStatus::EN_ATTENTE;

        /* =====================
        * Upload CV -> users.doc_url (JSON)
        * ===================== */
        if ($request->hasFile('cv')) {

            $docUrls = $user->doc_url;

            // convertir en tableau si nécessaire
            if (!$docUrls) {
                $docUrls = [];
            } elseif (is_string($docUrls)) {
                $docUrls = json_decode($docUrls, true);
                if (!is_array($docUrls)) {
                    $docUrls = [];
                }
            }

            $file = $request->file('cv');

            $filename = $file->store('documents', 'public');

            // ajout sécurisé
            $docUrls[] = $filename;

            // sauvegarde dans users
            $user->doc_url = $docUrls;
            $user->save();
        }

        /* =====================
        * Upload lettre de motivation
        * ===================== */
        if ($request->hasFile('lettre_motivation_fichier')) {
            $file = $request->file('lettre_motivation_fichier');

            $filename = $file->store('candidatures', 'public');

            // ajouter le chemin du fichier à $data
            $data['lettre_motivation_fichier'] = $filename;
        }

        // Créer la candidature avec tous les champs prêts
        $candidature = Candidature::create($data);

        return $candidature;
    }


    public function changerStatus(Candidature $candidature, CandidatureStatus $status): Candidature
    {
        $candidature->status = $status;
        $candidature->save();

        return $candidature;
    }

    public function supprimer(Candidature $candidature): void
    {
        $candidature->delete();
    }
}
