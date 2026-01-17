<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Resources\UsersFormationCollection;
use App\Http\Resources\UsersFormationResource;
use App\Models\UsersFormation;
use FedaPay\FedaPay;
use FedaPay\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\InscriptionFormationMail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class UsersFormationController extends Controller
{
    /**
     * Liste des inscriptions (admin)
     */
    public function index()
    {
        return new UsersFormationCollection(
            UsersFormation::with(['user', 'formation'])
                ->latest()
                ->paginate(10)
        );
    }


    public function fedapayWebhook(Request $request)
    {
        /* ----------------------------------------
        * 1) Payload brut & header
        * ---------------------------------------- */
        $payload = $request->getContent();
        $rawHeader = $request->header('X-Fedapay-Signature');
        $secret = env('FEDAPAY_WEBHOOK_SECRET'); // Clé secrète webhook

        if (!$rawHeader) {
            Log::warning('Webhook FedaPay: header X-Fedapay-Signature manquant', [
                'headers' => $request->headers->all()
            ]);
            return response()->json(['error' => 'Missing signature'], 403);
        }

        /* ----------------------------------------
        * 2) Extraire timestamp et signature "t=...,s=..."
        * ---------------------------------------- */
        if (!preg_match('/t=(\d+),s=([a-f0-9]+)/', $rawHeader, $match)) {
            Log::warning('Webhook FedaPay: impossible d\'extraire timestamp et signature', [
                'header' => $rawHeader
            ]);
            return response()->json(['error' => 'Invalid signature format'], 403);
        }

        $timestamp = $match[1];
        $signature = $match[2];

        /* ----------------------------------------
        * 3) Calculer la signature HMAC-SHA256
        * ---------------------------------------- */
        $dataToSign = $timestamp . '.' . $payload;
        $computed = hash_hmac('sha256', $dataToSign, $secret);

        if (!hash_equals($computed, $signature)) {
            Log::error('❌ Webhook FedaPay: signature invalide', [
                'received_header' => $rawHeader,
                'received_signature' => $signature,
                'computed_signature' => $computed,
            ]);
            return response()->json(['error' => 'Invalid signature'], 403);
        }

        Log::info('✅ Webhook FedaPay: signature validée');

        /* ----------------------------------------
        * 4) Décoder le JSON
        * ---------------------------------------- */
        $data = json_decode($payload, true);
        Log::info('Webhook FedaPay payload décodé', $data);

        /* ----------------------------------------
        * 5) Compatibilité V1 / V2
        * ---------------------------------------- */
        $event  = $data['event'] ?? $data['name'] ?? null;
        $object = $data['entity'] ?? $data;

        $status = $object['status'] ?? null;
        $metadata = $object['metadata'] ?? [];
        $transactionId = $object['id'] ?? null;

        /* ----------------------------------------
        * 6) Récupérer les inscriptions correspondantes
        * ---------------------------------------- */
        $inscriptions = UsersFormation::where('reference', $transactionId)->get();

        if ($inscriptions->isEmpty()) {
            Log::error("Aucune UsersFormation trouvée pour ce transaction_id", [
                'transaction_id' => $transactionId,
                'payload' => $payload
            ]);
            return response("NO INSCRIPTION FOUND", 404);
        }

        $inscriptionIds = $inscriptions->pluck('id')->toArray();
        Log::info("UsersFormation IDs reconstruits depuis la base", [
            'transaction_id' => $transactionId,
            'inscription_ids' => $inscriptionIds,
            'status' => $status
        ]);

        /* ----------------------------------------
        * 7) Vérifier statuts de paiement
        * ---------------------------------------- */
        $paidStatuses = ['approved', 'transferred', 'paid', 'completed', 'success'];

        if (in_array($status, $paidStatuses, true)) {
            Log::info("🚀 Paiement validé pour UsersFormation", [
                "inscription_ids" => $inscriptionIds,
                "status" => $status,
                "transaction_id" => $transactionId,
                "event" => $event
            ]);

            // Mise à jour des inscriptions
            foreach ($inscriptions as $inscription) {
                $inscription->status = 'paye';
                $inscription->reference = $transactionId;
                $inscription->save();
            }
        } else {
            Log::info("Webhook reçu mais paiement non validé", [
                "event" => $event,
                "status" => $status
            ]);
        }

        return response()->json(['ok' => true]);
    }

    // /**
    //  * Inscription à une formation + initialisation paiement FedaPay
    //  */
    // public function store(Request $request)
    // {
    //     try {
    //         $validated = $request->validate([
    //             'formation_id' => 'required|exists:formations,id',
    //             'nom' => 'required|string|max:255',
    //             'prenom' => 'required|string|max:255',
    //             'contact' => 'required|string|max:50',
    //             'email' => 'required|email',
    //             'montant' => 'required|numeric|min:0',
    //         ]);

    //         $user = $request->user();

    //         // 1️⃣ Création de l’inscription
    //         $usersFormation = UsersFormation::create([
    //             'id' => Str::uuid(),
    //             'user_id' => $user->id,
    //             'formation_id' => $validated['formation_id'],
    //             'nom' => $validated['nom'],
    //             'prenom' => $validated['prenom'],
    //             'contact' => $validated['contact'],
    //             'email' => $validated['email'],
    //             'montant' => $validated['montant'],
    //             'status' => 'en_attente',
    //             'reference' => 'TMP-' . Str::uuid(),
    //         ]);

    //         // =========================
    //         // Configuration FedaPay
    //         // =========================
    //         FedaPay::setApiKey(config('services.fedapay.secret_key'));
    //         FedaPay::setEnvironment(config('services.fedapay.mode'));

    //         Log::info('FedaPay configuré', [
    //             'mode' => config('services.fedapay.mode'),
    //             'key' => substr(config('services.fedapay.secret_key'), 0, 6) . '***'
    //         ]);

    //         // =========================
    //         // Création de la transaction
    //         // =========================
    //         try {
    //             $transaction = Transaction::create([
    //                 'description' => 'Paiement inscription formation',
    //                 'amount' => $validated['montant'],
    //                 'currency' => ['iso' => 'XOF'],
    //                 'callback_url' => route('fedapay.callback'),
    //                 'cancel_url' => route('fedapay.cancel'),
    //                 'metadata' => [
    //                     'users_formation_id' => $usersFormation->id,
    //                     'user_id' => $user->id,
    //                     'formation_id' => $validated['formation_id'],
    //                 ],
    //             ]);

    //             Log::info('FedaPay Transaction created debug', [
    //                 'object' => $transaction,
    //                 'id_direct' => $transaction->id ?? null,
    //                 'attrs' => method_exists($transaction, 'toArray')
    //                     ? $transaction->toArray()
    //                     : null
    //             ]);

    //             // Sauvegarde fedapay_transaction_id
    //             $usersFormation->reference = $transaction->id;
    //             $usersFormation->save();

    //             Log::info('Transaction FedaPay créée avec succès', [
    //                 'transaction_id' => $transaction->id
    //             ]);

    //         } catch (\FedaPay\Error\ApiConnection $e) {

    //             Log::error('Erreur APIConnection', [
    //                 'message' => $e->getMessage(),
    //                 'httpBody' => $e->getHttpBody(),
    //                 'httpStatus' => $e->getHttpStatus(),
    //             ]);

    //             return response()->json([
    //                 'error' => 'Problème de connexion à FedaPay',
    //                 'details' => $e->getMessage()
    //             ], 500);

    //         } catch (\Exception $e) {

    //             Log::error('Autre erreur pendant Transaction::create', [
    //                 'message' => $e->getMessage(),
    //                 'trace' => $e->getTraceAsString(),
    //             ]);

    //             return response()->json([
    //                 'error' => 'Erreur interne'
    //             ], 500);
    //         }

    //         // =========================
    //         // Génération du token
    //         // =========================
    //         try {
    //             $token = $transaction->generateToken();
    //             $paymentUrl = $token->url ?? ($token->getUrl() ?? null);

    //             Log::info('Token généré', [
    //                 'token' => $token->id ?? null,
    //                 'paymentUrl' => $paymentUrl
    //             ]);

    //             if (!$paymentUrl) {
    //                 Log::error('FedaPay: impossible d’obtenir l’URL de paiement', [
    //                     'tx' => $transaction
    //                 ]);

    //                 return response()->json([
    //                     'error' => 'Impossible de créer la transaction'
    //                 ], 500);
    //             }

    //         } catch (\Exception $e) {
    //             Log::error('Erreur lors de la génération du token', [
    //                 'message' => $e->getMessage()
    //             ]);

    //             throw $e;
    //         }

    //         // =========================
    //         // Réponse finale
    //         // =========================
    //         return response()->json([
    //             'url' => $paymentUrl,
    //             'users_formation_id' => $usersFormation->id,
    //             'fedapay_transaction_id' => $transaction->id,
    //             'amount' => $validated['montant'],
    //         ], 201);

    //     } catch (\Exception $e) {

    //         Log::error('Erreur dans store UsersFormation', [
    //             'exception' => $e
    //         ]);

    //         return response()->json([
    //             'error' => 'La création de la transaction a échoué',
    //             'message' => $e->getMessage()
    //         ], 500);
    //     }
    // }

    // public function storePublic(Request $request)
    // {
    //     try {
    //         $validated = $request->validate([
    //             'formation_id' => 'required|exists:formations,id',
    //             'nom' => 'required|string|max:255',
    //             'prenom' => 'required|string|max:255',
    //             'contact' => 'required|string|max:50',
    //             'email' => 'required|email',
    //             'montant' => 'required|numeric|min:0',
    //         ]);

    //         // Création inscription publique (user_id = null)
    //         $usersFormation = UsersFormation::create([
    //             'id' => Str::uuid(),
    //             'user_id' => null,
    //             'formation_id' => $validated['formation_id'],
    //             'nom' => $validated['nom'],
    //             'prenom' => $validated['prenom'],
    //             'contact' => $validated['contact'],
    //             'email' => $validated['email'],
    //             'montant' => $validated['montant'],
    //             'status' => 'en_attente',
    //             'reference' => 'TMP-' . Str::uuid(),
    //         ]);

    //         // =========================
    //         // Configuration FedaPay
    //         // =========================
    //         FedaPay::setApiKey(config('services.fedapay.secret_key'));
    //         FedaPay::setEnvironment(config('services.fedapay.mode'));

    //         Log::info('FedaPay configuré (public)', [
    //             'mode' => config('services.fedapay.mode'),
    //             'key' => substr(config('services.fedapay.secret_key'), 0, 6) . '***'
    //         ]);

    //         // =========================
    //         // Création transaction
    //         // =========================
    //         try {
    //             $transaction = Transaction::create([
    //                 'description' => 'Paiement inscription formation',
    //                 'amount' => $validated['montant'],
    //                 'currency' => ['iso' => 'XOF'],
    //                 'callback_url' => route('fedapay.callback'),
    //                 'cancel_url' => route('fedapay.cancel'),
    //                 'metadata' => [
    //                     'users_formation_id' => $usersFormation->id,
    //                     'formation_id' => $validated['formation_id'],
    //                 ],
    //             ]);

    //             Log::info('FedaPay Transaction created debug (public)', [
    //                 'object' => $transaction,
    //                 'id_direct' => $transaction->id ?? null
    //             ]);

    //             $usersFormation->update([
    //                 'reference' => $transaction->id
    //             ]);

    //         } catch (\FedaPay\Error\ApiConnection $e) {
    //             Log::error('Erreur APIConnection FedaPay (public)', [
    //                 'message' => $e->getMessage()
    //             ]);
    //             return response()->json([
    //                 'error' => 'Problème de connexion à FedaPay',
    //                 'details' => $e->getMessage()
    //             ], 500);

    //         } catch (\Exception $e) {
    //             Log::error('Erreur Transaction::create (public)', [
    //                 'message' => $e->getMessage()
    //             ]);
    //             return response()->json(['error' => 'Erreur interne'], 500);
    //         }

    //         // =========================
    //         // Génération du token
    //         // =========================
    //         try {
    //             $token = $transaction->generateToken();
    //             $paymentUrl = $token->url ?? ($token->getUrl() ?? null);

    //             if (!$paymentUrl) {
    //                 Log::error('FedaPay: impossible d’obtenir l’URL de paiement (public)', [
    //                     'tx' => $transaction
    //                 ]);
    //                 return response()->json(['error' => 'Impossible de créer la transaction'], 500);
    //             }
    //         } catch (\Exception $e) {
    //             Log::error('Erreur génération token (public)', ['message' => $e->getMessage()]);
    //             throw $e;
    //         }

    //         return response()->json([
    //             'url' => $paymentUrl,
    //             'users_formation_id' => $usersFormation->id,
    //             'fedapay_transaction_id' => $transaction->id,
    //             'amount' => $validated['montant'],
    //         ], 201);

    //     } catch (\Exception $e) {
    //         Log::error('Erreur storePublic UsersFormation', ['exception' => $e]);
    //         return response()->json([
    //             'error' => 'La création de la transaction a échoué',
    //             'message' => $e->getMessage()
    //         ], 500);
    //     }
    // }



    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'formation_id' => 'required|exists:formations,id',
                'nom' => 'required|string|max:255',
                'prenom' => 'required|string|max:255',
                'contact' => 'required|string|max:50',
                'email' => 'required|email',
                'montant' => 'required|numeric|min:0',
            ]);

            $user = $request->user();

            // ✅ Création de l’inscription
            $usersFormation = UsersFormation::create([
                'id' => Str::uuid(),
                'user_id' => $user->id,
                'formation_id' => $validated['formation_id'],
                'nom' => $validated['nom'],
                'prenom' => $validated['prenom'],
                'contact' => $validated['contact'],
                'email' => $validated['email'],
                'montant' => $validated['montant'],
                'status' => 'en_attente',
                'reference' => 'TMP-' . Str::uuid(),
            ]);

            // =============================
            // 📧 ENVOI EMAIL ENTREPRISE
            // =============================
            try {
                Mail::to('cssessinou@gmail.com')
                    ->send(new InscriptionFormationMail($usersFormation));
            } catch (\Exception $mailException) {
                Log::warning('Email inscription non envoyé', [
                    'error' => $mailException->getMessage()
                ]);
            }

            return response()->json([
                'message' => 'Inscription enregistrée avec succès',
                'users_formation_id' => $usersFormation->id,
            ], 201);

        } catch (\Exception $e) {
            Log::error('Erreur store UsersFormation', ['exception' => $e]);
            return response()->json([
                'error' => 'La création de l’inscription a échoué',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    
    public function storePublic(Request $request)
    {
        try {
            $validated = $request->validate([
                'formation_id' => 'required|exists:formations,id',
                'nom' => 'required|string|max:255',
                'prenom' => 'required|string|max:255',
                'contact' => 'required|string|max:50',
                'email' => 'required|email',
                'montant' => 'required|numeric|min:0',
            ]);

            // ✅ Création de l’inscription publique
            $usersFormation = UsersFormation::create([
                'id' => Str::uuid(),
                'user_id' => null,
                'formation_id' => $validated['formation_id'],
                'nom' => $validated['nom'],
                'prenom' => $validated['prenom'],
                'contact' => $validated['contact'],
                'email' => $validated['email'],
                'montant' => $validated['montant'],
                'status' => 'en_attente',
                'reference' => 'TMP-' . Str::uuid(),
            ]);

            // =============================
            // 📧 ENVOI EMAIL ENTREPRISE
            // =============================
            try {
                Mail::to('cssessinou@gmail.com')
                    ->send(new InscriptionFormationMail($usersFormation));
            } catch (\Exception $mailException) {
                Log::warning('Email inscription public non envoyé', [
                    'error' => $mailException->getMessage()
                ]);
            }

            return response()->json([
                'message' => 'Inscription enregistrée avec succès (public)',
                'users_formation_id' => $usersFormation->id,
            ], 201);

        } catch (\Exception $e) {
            Log::error('Erreur storePublic UsersFormation', ['exception' => $e]);
            return response()->json([
                'error' => 'La création de l’inscription a échoué',
                'message' => $e->getMessage()
            ], 500);
        }
    }



    /**
     * Détails d'une inscription
     */
    public function show(UsersFormation $usersFormation)
    {
        return new UsersFormationResource(
            $usersFormation->load(['user', 'formation'])
        );
    }

    /**
     * Mise à jour du statut (paiement / annulation)
     */
    public function update(Request $request, UsersFormation $usersFormation)
    {
        $validated = $request->validate([
            'status' => 'required|in:en_attente,paye,annule',
            'reference' => 'sometimes|string|max:255',
        ]);

        $usersFormation->update($validated);

        return new UsersFormationResource($usersFormation->fresh());
    }

    /**
     * Inscriptions de l'utilisateur connecté
     */
    public function myInscriptions(Request $request)
    {
        return new UsersFormationCollection(
            UsersFormation::with('formation')
                ->where('user_id', $request->user()->id)
                ->latest()
                ->get()
        );
    }

    public function formationInscriptions(Request $request, $id)
    {
        return new UsersFormationCollection(
            UsersFormation::with('user') // si tu veux les infos de l'utilisateur
                ->where('formation_id', $id)
                ->latest()
                ->get()
        );
    }

    public function destroy(Request $request, $id)
    {
        $inscription = UsersFormation::find($id);

        if (!$inscription) {
            return response()->json([
                'message' => 'Inscription non trouvée'
            ], 404);
        }

        // 🔐 Optionnel : vérifier que l’utilisateur a le droit de supprimer (Admin ou utilisateur)
        $user = $request->user();
        if ($user->role !== 'admin') {
            return response()->json([
                'message' => 'Non autorisé à supprimer cette inscription'
            ], 403);
        }

        $inscription->delete();

        return response()->json([
            'message' => 'Inscription supprimée avec succès'
        ]);
    }

    public function callback(Request $request)
    {
        $status = $request->query('status', 'unknown');

        // 🔑 Récupérer la transaction FedaPay
        $transactionId = $request->query('transaction_id');

        $usersFormation = UsersFormation::where(
            'reference',
            $transactionId
        )->first();

        if (!$usersFormation) {
            abort(404, 'Transaction inconnue');
        }

        // Mise à jour statut
        if ($status === 'approved') {
            $usersFormation->update(['status' => 'paid']);
        }

        $formationId = $usersFormation->formation_id;

        $frontend = env('FRONTEND_URL', config('app.frontend_url'));

        return redirect(
            "$frontend/formations/{$formationId}/inscription?status={$status}"
        );
    }


    public function cancel(Request $request)
    {
        $transactionId = $request->query('transaction_id');

        $usersFormation = UsersFormation::where(
            'reference',
            $transactionId
        )->first();

        if ($usersFormation) {
            $usersFormation->update(['status' => 'cancelled']);
            $formationId = $usersFormation->formation_id;
        }

        $frontend = env('FRONTEND_URL', config('app.frontend_url'));

        return redirect(
            "$frontend/formations/{$formationId}/inscription?status=cancelled"
        );
    }

}

