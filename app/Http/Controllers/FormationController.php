<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Resources\FormationCollection;
use App\Http\Resources\FormationResource;
use App\Models\Formation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FormationController extends Controller
{
    /**
     * Liste des formations avec pagination
     */
    public function index(Request $request)
    {
        $query = Formation::query();

        // 🔍 Recherche texte
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where('titre', 'LIKE', "%{$search}%");
        }

        // 📂 Filtre catégorie
        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        return new FormationCollection(
            $query->latest()->paginate(10)
        );
    }


    /**
     * Création d'une nouvelle formation
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'titre' => 'required|string|max:255',
            'description' => 'required|string',
            'duree' => 'required|string|max:100',
            'date_debut' => 'required|date',
            'cout' => 'nullable|numeric|min:0',
            'images.*' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
        ]);

        $imagePaths = [];

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $filename = hash('sha256', time() . uniqid()) . '.' . $image->extension();
                $image->storeAs('formations', $filename, 'public');
                // Stocke le chemin relatif, pas l'URL complète
                $imagePaths[] = 'formations/' . $filename;
            }
        }

        $formation = Formation::create([
            'id' => Str::uuid(),
            'titre' => $validated['titre'],
            'description' => $validated['description'],
            'duree' => $validated['duree'],
            'date_debut' => $validated['date_debut'],
            'cout' => $validated['cout'] ?? null,
            'images' => $imagePaths,
        ]);

        return new FormationResource($formation);
    }

    /**
     * Afficher une formation
     */
    public function show(Formation $formation)
    {
        return new FormationResource($formation);
    }

    /**
     * Mise à jour d'une formation
     */
    public function update(Request $request, Formation $formation)
    {
        $validated = $request->validate([
            'titre' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'duree' => 'sometimes|string|max:100',
            'date_debut' => 'sometimes|date',
            'cout' => 'nullable|numeric|min:0',
            'images.*' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
        ]);

        $imagePaths = $formation->images ?? [];

        if ($request->hasFile('images')) {
            // Supprimer les anciennes images existantes
            // if (!empty($formation->images) && is_array($formation->images)) {
            //     foreach ($formation->images as $oldImage) {
            //         Storage::disk('public')->delete($oldImage);
            //     }
            // }

            $imagePaths = [];
            foreach ($request->file('images') as $image) {
                $filename = hash('sha256', time() . uniqid()) . '.' . $image->extension();
                $image->storeAs('formations', $filename, 'public');
                $imagePaths[] = 'formations/' . $filename;
            }
        }

        $formation->update([
            ...$validated,
            'images' => $imagePaths,
        ]);

        return new FormationResource($formation->fresh());
    }



    public function deleteImage(Formation $formation, int $index)
    {
        $images = $formation->images ?? [];

        // 🔒 Sécurité
        if (!is_array($images)) {
            return response()->json([
                'message' => 'Images invalides'
            ], 400);
        }

        if (!isset($images[$index])) {
            return response()->json([
                'message' => 'Image introuvable'
            ], 404);
        }

        $imagePath = $images[$index];

        // Suppression fichier
        if (Storage::disk('public')->exists($imagePath)) {
            Storage::disk('public')->delete($imagePath);
        }

        // Suppression du tableau
        array_splice($images, $index, 1);

        $formation->images = array_values($images);
        $formation->save();

        return response()->json([
            'message' => 'Image supprimée avec succès',
            'images' => $formation->images
        ]);
    }


    /**
     * Suppression d'une formation
     */
    public function destroy(Formation $formation)
    {
        // Supprimer les images du stockage
        if (!empty($formation->images) && is_array($formation->images)) {
            foreach ($formation->images as $image) {
                Storage::disk('public')->delete($image);
            }
        }

        $formation->delete();

        return response()->json([
            'message' => 'Formation supprimée avec succès'
        ]);
    }
}





//  php

// namespace App\Http\Controllers;

// use App\Http\Controllers\Controller;
// use App\Http\Resources\FormationCollection;
// use App\Http\Resources\FormationResource;
// use App\Models\Formation;
// use Illuminate\Http\Request;
// use Illuminate\Support\Facades\Storage;
// use Illuminate\Support\Str;

// class FormationController extends Controller
// {
//     public function index()
//     {
//         return new FormationCollection(
//             Formation::latest()->paginate(10)
//         );
//     }

//     public function store(Request $request)
//     {
//         $validated = $request->validate([
//             'titre' => 'required|string|max:255',
//             'description' => 'required|string',
//             'duree' => 'required|string|max:100',
//             'date_debut' => 'required|date',
//             'cout' => 'nullable|numeric|min:0',
//             'images.*' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
//         ]);

//         $imagePaths = [];

//         if ($request->hasFile('images')) {

//             foreach ($request->file('images') as $image) {
//                 $extension = $image->extension();
//                 $filename = hash('sha256', time() . uniqid()) . '.' . $extension;

//                 $image->storeAs('formations', $filename, 'public');

//                 $imagePaths[] = asset('storage/formations/' . $filename);
//             }
//         }

//         $formation = Formation::create([
//             'id' => Str::uuid(),
//             'titre' => $validated['titre'],
//             'description' => $validated['description'],
//             'duree' => $validated['duree'],
//             'date_debut' => $validated['date_debut'],
//             'cout' => $validated['cout'] ?? null,
//             'images' => $imagePaths,
//         ]);

//         return new FormationResource($formation);
//     }

//     public function show(Formation $formation)
//     {
//         return new FormationResource($formation);
//     }
    
//     public function update(Request $request, Formation $formation)
//     {
//         $validated = $request->validate([
//             'titre' => 'sometimes|string|max:255',
//             'description' => 'sometimes|string',
//             'duree' => 'sometimes|string|max:100',
//             'date_debut' => 'sometimes|date',
//             'cout' => 'nullable|numeric|min:0',
//             'images.*' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
//         ]);

//         $imagePaths = $formation->images ?? [];

//         if ($request->hasFile('images')) {

//             // 🔥 Suppression des anciennes images
//             if (!empty($formation->images) && is_array($formation->images)) {
//                 foreach ($formation->images as $oldImageUrl) {
//                     $oldPath = str_replace(asset('storage') . '/', '', $oldImageUrl);
//                     Storage::disk('public')->delete($oldPath);
//                 }
//             }

//             $imagePaths = [];

//             foreach ($request->file('images') as $image) {
//                 $extension = $image->extension();
//                 $filename = hash('sha256', time() . uniqid()) . '.' . $extension;

//                 $image->storeAs('formations', $filename, 'public');

//                 $imagePaths[] = asset('storage/formations/' . $filename);
//             }
//         }

//         $formation->update([
//             ...$validated,
//             'images' => $imagePaths,
//         ]);

//         return new FormationResource($formation->fresh());
//     }


//     public function destroy(Formation $formation)
//     {
//         if ($formation->images) {
//             foreach ($formation->images as $image) {
//                 Storage::disk('public')->delete($image);
//             }
//         }

//         $formation->delete();

//         return response()->json([
//             'message' => 'Formation supprimée avec succès'
//         ]);
//     }
// } -->
