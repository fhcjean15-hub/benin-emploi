<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Category;
use Illuminate\Support\Str;

class CreateCategories extends Command
{
    protected $signature = 'create:categories';
    protected $description = 'Insérer toutes les catégories de métiers';

    public function handle()
    {
        $categories = [

            // TECH
            'Développeur web',
            'Développeur mobile',
            'Développeur backend',
            'Développeur frontend',
            'Fullstack developer',
            'Ingénieur logiciel',
            'Data analyst',
            'Data scientist',
            'Ingénieur IA',
            'Machine learning engineer',
            'DevOps',
            'Administrateur système',
            'Administrateur réseau',
            'Technicien IT',
            'Support informatique',
            'Testeur logiciel',
            'Architecte logiciel',
            'Cyber sécurité',
            'Cloud engineer',
            'UX/UI designer',

            // BUSINESS
            'Manager',
            'Assistant administratif',
            'Directeur général',
            'Chef de projet',
            'Consultant',
            'Business developer',

            // MARKETING
            'Community manager',
            'Digital marketer',
            'Rédacteur web',
            'SEO specialist',

            // FINANCE
            'Comptable',
            'Analyste financier',
            'Auditeur',

            // SANTE
            'Médecin',
            'Infirmier',
            'Pharmacien',

            // EDUCATION
            'Enseignant',
            'Formateur',

            // BTP
            'Ingénieur civil',
            'Architecte',
            'Électricien',
            'Plombier',

            // LOGISTIQUE
            'Chauffeur',
            'Logisticien',

            // COMMERCE
            'Commercial',
            'Vendeur',

            // RESTAURATION
            'Cuisinier',
            'Serveur',

            // CREATIF
            'Graphiste',
            'Photographe',

            // AGRICULTURE
            'Agriculteur',
            'Vétérinaire',

            // ONG
            'Travailleur social',

            // ARTISANAT
            'Tailleur',
            'Coiffeur',
        ];

        foreach ($categories as $titre) {

            Category::firstOrCreate(
                ['titre' => $titre],
                [
                    'id' => Str::uuid()
                ]
            );
        }

        $this->info('✅ Catégories insérées avec succès !');
    }
}
