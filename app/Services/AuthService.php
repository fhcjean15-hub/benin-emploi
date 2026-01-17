<?php
namespace App\Services;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;


class AuthService
{
    public function register(array $data)
    {
        //enregistrer la photo ou le logo si fourni
        $photoPath = null;
        if (isset($data['photo']) && $data['photo'] instanceof \Illuminate\Http\UploadedFile) {
            $photoPath = $data['photo']->store('photos', 'public');
        }

        $user = User::create([
            'nom' => $data['nom'],
            'prenom' => $data['prenom'],
            'email' => $data['email'],
            'profile' => $data['profile'], //'x: Analyste programmeur',
            'password' => Hash::make($data['password']),
            'role' => $data['role'],
            'photo' => $photoPath,
        ]);

        return compact('user');
    }

    public function login(array $credentials)
    {
        if (!Auth::attempt($credentials)) {
            throw new \Exception('Identifiants incorrects');
        }

        $user = Auth::user();
        if ($user->status !== 'actif') {
            return response()->json([
                'message' => 'Compte désactivé ou suspendu'
            ], 403);
        }

        $token = $user->createToken('api_token')->plainTextToken;

        return ['user'=>$user,
                'token'=>$token,
    ];
    }

    public function logout(User $user)
    {
        $user->tokens()->delete();
    }

    //mettre à jour les informations personnelles
    public function updateProfile(array $data)
    {
        $user = Auth::user();
        $user->update([
            'nom' => $data['nom'],
            'prenom' => $data['prenom'],
            'email' => $data['email'],
            'profile' => $data['profile'],
        ]);
        return $user;
    }
}