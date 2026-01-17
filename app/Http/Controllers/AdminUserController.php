<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Hash;
use App\Http\Resources\UserResource;

class AdminUserController extends Controller
{
    /**
     * Liste des utilisateurs
     */
    public function index()
    {
        $users = User::latest()->paginate(10);
        return UserResource::collection($users);
    }

    /**
     * Détails d’un utilisateur
     */
    public function show(string $id)
    {
        $user = User::findOrFail($id);

        return response()->json([
            'data' => $user
        ]);
    }

    /**
     * Mise à jour d’un utilisateur
     */
    public function update(Request $request, string $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'nom'     => 'sometimes|string|max:255',
            'prenom'  => 'sometimes|string|max:255',
            'email'   => [
                'sometimes',
                'email',
                Rule::unique('users')->ignore($user->id),
            ],
            'role'    => 'sometimes|in:admin,candidat',
            'status'  => 'sometimes|in:actif,inactif,suspendu',
            'password'=> 'nullable|min:6',
        ]);

        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);

        return response()->json([
            'message' => 'Utilisateur mis à jour avec succès',
            'data' => $user
        ]);
    }

    /**
     * Changer uniquement le status
     */
    public function updateStatus(Request $request, string $id)
    {
        $request->validate([
            'status' => 'required|in:actif,inactif,suspendu',
        ]);

        $user = User::findOrFail($id);
        $user->update([
            'status' => $request->status
        ]);

        return response()->json([
            'message' => 'Statut mis à jour',
            'data' => $user
        ]);
    }

    /**
     * Supprimer un utilisateur
     */
    public function destroy(string $id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json([
            'message' => 'Utilisateur supprimé avec succès'
        ]);
    }
}
