<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Resources\OffreResource;
use App\Http\Resources\CandidatureCollection;
use App\Models\Offre;
use App\Models\Candidature;
use App\Services\OffreService;
use Illuminate\Http\Request;

class OffreController extends Controller
{
    public function __construct(private OffreService $offreService) {}

    public function index(Request $request)
    {
        $query = Offre::query();

        // 🔍 Recherche texte
        if ($request->filled('search')) {
            $query->where('intitule', 'like', '%' . $request->search . '%');
        }

        // 📄 Type de contrat
        if ($request->filled('type')) {
            $query->where('type_contrat', $request->type);
        }

        // 📍 Localisation
        if ($request->filled('localisation')) {
            $query->where('localisation', $request->localisation);
        }

        return OffreResource::collection(
            $query->latest()->paginate(10)
        );
    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'intitule' => 'required|string',
            'localisation' => 'required|string|max:255',
            'type_contrat' => 'required|string|in:CDI,CDD,Stage,Alternance',
            'type_offre' => 'required|string|in:emploi,stage',
            'duree' => 'nullable|string',
            'salaire' => 'nullable|numeric',
            'description' => 'required|string',
            'date_cloture' => 'required|date',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        /* =====================
        * Upload image
        * ===================== */
        if ($request->hasFile('image')) {
            $image = $request->file('image');

            $filename = hash('sha256', time() . uniqid()) . '.' . $image->extension();
            $image->storeAs('offres', $filename, 'public');

            // chemin relatif stocké en DB
            $validated['image'] = 'offres/' . $filename;
        }

        $offre = $this->offreService->create($validated);

        return response()->json([
            'message' => 'Offre créée avec succès',
            'data' => new OffreResource($offre->load('category'))
        ], 201);
    }

    public function show(Offre $offre)
    {
        return new OffreResource($offre->load('category'));
    }

    public function update(Request $request, Offre $offre)
    {
        $validated = $request->validate([
            'category_id' => 'sometimes|exists:categories,id',
            'intitule' => 'sometimes|string',
            'localisation' => 'required|string|max:255',
            'type_contrat' => 'sometimes|string',
            'type_offre' => 'sometimes|string',
            'duree' => 'nullable|string',
            'salaire' => 'nullable|numeric',
            'description' => 'sometimes|string',
            'date_cloture' => 'sometimes|date',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
        ]);

        if ($request->hasFile('image')) {
            $image = $request->file('image');

            $filename = hash('sha256', time() . uniqid()) . '.' . $image->extension();
            $image->storeAs('offres', $filename, 'public');

            // (optionnel) supprimer l’ancienne image
            if ($offre->image && Storage::disk('public')->exists($offre->image)) {
                Storage::disk('public')->delete($offre->image);
            }

            $validated['image'] = 'offres/' . $filename;
        }

        $offre = $this->offreService->update($offre, $validated);

        return response()->json([
            'message' => 'Offre mise à jour',
            'data' => new OffreResource($offre->load('category'))
        ]);
    }

    // public function getByOffre($offreId)
    // {
    //     // Vérifie si l'offre existe
    //     $offre = Offre::find($offreId);
    //     if (!$offre) {
    //         return response()->json([
    //             'message' => 'Offre non trouvée.'
    //         ], 404);
    //     }

    //     // Récupère toutes les candidatures liées à cette offre
    //     $candidatures = $offre->candidatures()->latest()->get();

    //     return response()->json([
    //         'data' => $candidatures
    //     ]);
    // }

    public function getByOffre(Request $request, $offreId)
    {
        return new CandidatureCollection(
            Candidature::with('user') // si tu veux les infos de l'utilisateur
                ->where('offre_id', $offreId)
                ->latest()
                ->get()
        );
    }

    public function destroy(Offre $offre)
    {
        // Optionnel : bloquer si candidatures
        if ($offre->candidatures()->exists()) {
            return response()->json([
                'message' => 'Impossible de supprimer une offre avec des candidatures'
            ], 422);
        }

        $this->offreService->delete($offre);

        return response()->json([
            'message' => 'Offre supprimée'
        ]);
    }
}
