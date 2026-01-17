<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        return response()->json(Category::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'titre' => 'required|string|unique:categories,titre',
        ]);

        $category = Category::create($validated);

        return response()->json([
            'message' => 'Catégorie créée avec succès',
            'data' => $category
        ], 201);
    }

    public function show(Category $category)
    {
        return response()->json($category);
    }

    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'titre' => 'required|string|unique:categories,titre,' . $category->id,
        ]);

        $category->update($validated);

        return response()->json([
            'message' => 'Catégorie mise à jour',
            'data' => $category
        ]);
    }

    public function destroy(Category $category)
    {
        // Optionnel : bloquer si offres liées
        if ($category->offres()->exists()) {
            return response()->json([
                'message' => 'Impossible de supprimer une catégorie contenant des offres'
            ], 422);
        }

        $category->delete();

        return response()->json([
            'message' => 'Catégorie supprimée'
        ]);
    }
}
