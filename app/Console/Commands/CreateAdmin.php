<?php

namespace App\Console\Commands;

use App\Enums\RoleUser;
use Illuminate\Console\Command;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class CreateAdmin extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'admin:create';

    /**
     * The console command description.
     */
    protected $description = 'Créer un administrateur avec validation';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $data = [
            'nom'      => $this->ask('Nom'),
            'prenom'   => $this->ask('Prénom'),
            'email'    => $this->ask('Email'),
            'password' => $this->secret('Mot de passe'),
        ];

        // Validation
        $validator = Validator::make($data, [
            'nom'      => 'required|string|min:2|max:50',
            'prenom'   => 'required|string|min:2|max:50',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            $this->error('❌ Erreurs de validation :');

            foreach ($validator->errors()->all() as $error) {
                $this->line(' - ' . $error);
            }

            return Command::FAILURE;
        }

        // Création de l'admin
        $user = User::create([
            'nom'      => $data['nom'],
            'prenom'   => $data['prenom'],
            'email'    => $data['email'],
            'password' => Hash::make($data['password']),
            'role'     => RoleUser::ADMIN->value,
        ]);

        $this->info('✅ Administrateur créé avec succès.');
        $this->table(
            ['ID', 'Nom', 'Prénom', 'Email', 'Rôle'],
            [[
                $user->id,
                $user->nom,
                $user->prenom,
                $user->email,
                $user->role
            ]]
        );

        return Command::SUCCESS;
    }
}
