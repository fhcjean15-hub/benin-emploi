<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Resources\BesoinResource;
use App\Models\Besoin;
use App\Enums\TypeBesoin;
use App\Services\BesoinService;
use Illuminate\Http\Request;

class BesoinController extends Controller
{
    public function __construct(private BesoinService $service) {}

    public function index()
    {
        $besoins = Besoin::latest()->paginate(10);
        return BesoinResource::collection($besoins);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom_entreprise'     => 'required|string|max:255',
            'email'              => 'required|email',
            'numero'             => 'required|string|max:20',
            'personne_contact'   => 'required|string|max:255',
            'type_besoin'        => 'required|string|max:255',
            'description'        => 'required|string',
            'grille_tarifaire'   => 'required|in:emploi_1_jour,emploi_7_jours,emploi_mois,formation_1_jour,formation_7_jours,formation_mois,rh_1_jour,rh_7_jours,rh_mois,com_1_jour,com_7_jours,com_mois,acc_1_jour,acc_7_jours,acc_mois,autre_basique,autre_standard,autre_premium',
            'images'             => 'nullable|array',
            'images.*'           => 'nullable|image|max:5120',
        ]);

        $besoin = $this->service->create($validated);

        return response()->json([
            'message' => 'Besoin créé avec succès',
            'data' => new BesoinResource($besoin)
        ], 201);
    }

    public function show(Besoin $besoin)
    {
        return new BesoinResource($besoin);
    }

    //ne sera certainement pas necessaire
    public function update(Request $request, Besoin $besoin)
    {
        $validated = $request->validate([
           'nom_entreprise'     => 'required|string|max:255',
            'email'              => 'required|email',
            'numero'             => 'required|string|max:20',
            'personne_contact'   => 'required|string|max:255',
            'type_besoin'        => 'required|string|max:255',
            'description'        => 'required|string',
            'grille_tarifaire'   => 'required|in:emploi_1_jour,emploi_7_jours,emploi_mois,formation_1_jour,formation_7_jours,formation_mois,rh_1_jour,rh_7_jours,rh_mois,com_1_jour,com_7_jours,com_mois,acc_1_jour,acc_7_jours,acc_mois,autre_basique,autre_standard,autre_premium',
            'images'             => 'nullable|array',
            'images.*'           => 'nullable|image|max:5120',
        ]);

        $besoin = $this->service->update($besoin, $validated);

        return response()->json([
            'message' => 'Besoin mis à jour',
            'data' => new BesoinResource($besoin)
        ]);
    }

    public function destroy(Besoin $besoin)
    {
        $this->service->delete($besoin);
        return response()->json(['message' => 'Besoin supprimé']);
    }
}
