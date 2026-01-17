<?php

namespace App\Http\Controllers;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\AuthService;

use Illuminate\Http\Request;
class AuthController extends Controller
{
    public function __construct(private AuthService $authService) {}

    public function register(Request $request)
    {
        $validatedData = $request->validate([
            'nom' => 'required|string',
            'prenom' => 'required|string',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
            'role' => 'required|in:candidat,admin',
            'profile' => 'string|nullable',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $data = $this->authService->register($validatedData);

        return response()->json([
            'message' => 'Compte créé avec succès',
        ], 201);
    }

    public function login(Request $request)
    {
        try {
            $validatedData = $request->validate([
            'email' => 'required|email',
            'password' => 'required|min:6',
        ]);
            $data = $this->authService->login($validatedData);
            return response()->json([
                'message' => 'Connexion réussie',
                'data' => [
                    'user' => new UserResource($data['user']),
                    'token' => $data['token'],
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 401);
        }
    }

    public function me(Request $request)
    {
        return new UserResource($request->user());
    }

    public function logout(Request $request)
    {
        $this->authService->logout($request->user());

        return response()->json([
            'message' => 'Déconnexion réussie'
        ]);
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validatedData = $request->validate([
            'nom' => 'required|string',
            'prenom' => 'required|string',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'profile' => 'nullable|string|max:255',
            'password' => 'nullable|string|min:6|confirmed',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'documents.*' => 'nullable|file|mimes:pdf,doc,docx|max:5120',
        ]);

        // MàJ infos de base
        $user->nom = $validatedData['nom'];
        $user->prenom = $validatedData['prenom'];
        $user->email = $validatedData['email'];
        $user->profile = $validatedData['profile'] ?? $user->profile;

        // MàJ mot de passe si fourni
        if (!empty($validatedData['password'])) {
            $user->password = \Hash::make($validatedData['password']);
        }

        // MàJ photo
        if ($request->hasFile('photo')) {
            $oldPhoto = $user->photo;
            $user->photo = $request->file('photo')->store('photos', 'public');
            if ($oldPhoto) \Storage::disk('public')->delete($oldPhoto);
        }

        // MàJ documents
        if ($request->hasFile('documents')) {
            $docUrls = $user->doc_url;

            // 🔹 Convertir en tableau si nécessaire
            if (!$docUrls) {
                $docUrls = [];
            } elseif (is_string($docUrls)) {
                $docUrls = json_decode($docUrls, true);
                if (!is_array($docUrls)) {
                    $docUrls = [];
                }
            }

            foreach ($request->file('documents') as $file) {
                $filename = $file->store('documents', 'public');
                $docUrls[] = $filename; // ajout sécurisé
            }

            $user->doc_url = $docUrls;
        }

        $user->save();

        return new UserResource($user);
    }

    

    public function deleteDocument(Request $request, $index)
    {
        $user = $request->user();

        $docUrls = $user->doc_url ?? [];

        // 🔥 Assurez-vous que docUrls est un tableau
        if (!is_array($docUrls)) {
            $docUrls = is_string($docUrls) ? json_decode($docUrls, true) : [];
        }

        if (!isset($docUrls[$index])) {
            return response()->json(['message' => 'Document introuvable'], 404);
        }

        $path = $docUrls[$index];

        // Supprimer le fichier physique
        if (\Storage::disk('public')->exists($path)) {
            \Storage::disk('public')->delete($path);
        }

        // Supprimer du tableau
        array_splice($docUrls, $index, 1);

        // Mettre à jour l'utilisateur
        $user->doc_url = $docUrls;
        $user->save();

        return response()->json([
            'message' => 'Document supprimé avec succès',
            'doc_url' => $docUrls
        ]);
    }

    // DELETE USER

    public function destroy(Request $request)
    {
        $user = $request->user();
        //recuperer et supprimer la photo et le document s'ils existent
        if ($user->photo) {
            \Storage::disk('public')->delete($user->photo);
        }
        if ($user->doc_url['cv'] ?? null) {
            \Storage::disk('public')->delete($user->doc_url['cv']);
        }
         $this->authService->logout($user);
        $user->delete();

        return response()->json(['message' => 'Utilisateur supprimé']);
    }
}