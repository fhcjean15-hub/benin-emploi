<?php

namespace App\Http\Controllers;

use App\Enums\RoleUser;
use App\Http\Controllers\Controller;
use App\Http\Resources\CandidatureResource;
use App\Models\Candidature;
use App\Services\CandidatureService;
use App\Enums\CandidatureStatus;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CandidatureController extends Controller
{
    public function __construct(private CandidatureService $service) {}

    // Liste des candidatures de l'utilisateur
    public function index(Request $request)
    {
        $candidatures = [];
        
        //admin
        if($request->user()->role ==  RoleUser::ADMIN->value){
            $candidatures = Candidature::all()->with('offre')->latest()->get();
        }
        else{
            $candidatures = $request->user()->candidatures()->with('offre')->latest()->get();
        }
        
        return CandidatureResource::collection($candidatures);
    }

    // Postuler à une offre
    public function store(Request $request)
    {
        $validated = $request->validate([
            'offre_id' => 'required|exists:offres,id',
            'lettre_motivation' => 'nullable',
            'lettre_motivation_fichier' => 'nullable|file|mimes:pdf|max:5120',
            'cv' => 'nullable|file|mimes:pdf,doc,docx|max:5120',
        ]);

        $candidature = $this->service->postuler($request, $validated);

        return response()->json([
            'message' => 'Candidature envoyée',
            'data' => new CandidatureResource($candidature->load('offre'))
        ], 201);
    }

        /**
     * Détails d'une inscription
     */
    public function show(Candidature $candidature)
    {
        return new CandidatureResource(
            $candidature->load(['user', 'offre'])
        );
    }


    // Changer le statut (admin ou recruteur)
    public function updateStatus(Request $request, Candidature $candidature)
    {
        $validated = $request->validate([
            'status' => 'required|in:' . implode(',', CandidatureStatus::values())
        ]);

        $newStatus = CandidatureStatus::from($validated['status']);
        $candidature = $this->service->changerStatus($candidature, $newStatus);

        return response()->json([
            'message' => 'Statut mis à jour',
            'data' => new CandidatureResource($candidature->load('offre'))
        ]);
    }

    public function myCandidatures(Request $request)
    {
        return CandidatureResource::collection(
            Candidature::with(['offre', 'user'])
                ->where('user_id', $request->user()->id)
                ->latest()
                ->get()
        );
    }


    public function destroy(Candidature $candidature)
    {
        $this->service->supprimer($candidature);
        return response()->json(['message' => 'Candidature supprimée']);
    }
}
