<?php

use App\Http\Controllers\BesoinController;
use App\Http\Controllers\OffreController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FormationController;
use App\Http\Controllers\UsersFormationController;
use App\Http\Controllers\CandidatureController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\AdminUserController;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


// =========================
// 🔓 Routes publiques
// =========================
Route::get('/formations', [FormationController::class, 'index']);
Route::get('/formations/{formation}', [FormationController::class, 'show']);

Route::get('/offres', [OffreController::class, 'index']);
Route::get('/offres/{offre}', [OffreController::class, 'show']);

// =========================
// 🔐 Routes protégées
// =========================
Route::middleware(['auth:sanctum', 'is_admin'])->group(function () {

    // CRUD Formation (admin / formateur)
    Route::post('/formations', [FormationController::class, 'store']);
    Route::put('/formations/{formation}', [FormationController::class, 'update']);
    Route::post(
        '/formations/{formation}/images/{index}',
        [FormationController::class, 'deleteImage']
    );
    Route::delete('/formations/{formation}', [FormationController::class, 'destroy']);

    Route::get('/candidatures', [CandidatureController::class, 'index']);
    Route::get('/candidatures/{candidature}', [CandidatureController::class, 'show']);
    Route::put('/candidatures/{candidature}', [CandidatureController::class, 'update']);
    Route::delete('/candidatures/{candidature}', [CandidatureController::class, 'destroy']);
    
    Route::post('/offres', [OffreController::class, 'store']);
    Route::put('/offres/{offre}', [OffreController::class, 'update']);
    Route::delete('/offres/{offre}', [OffreController::class, 'destroy']);

    Route::get('offres/{offre}/candidatures', [OffreController::class, 'getByOffre']);
});

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// ------------------------
// Routes sécurisées (auth:sanctum)
// ------------------------
Route::middleware('auth:sanctum')->group(function () {
    // Créer une inscription pour utilisateur connecté
    Route::post('/users-formations', [UsersFormationController::class, 'store']);
    Route::post('/candidatures', [CandidatureController::class, 'store']);
    Route::get('/mescandidatures',[CandidatureController::class, 'myCandidatures']);

});

Route::middleware(['auth:sanctum', 'is_admin'])->group(function () {

    // Liste des inscriptions de l'utilisateur connecté
    Route::get('/users-formations', [UsersFormationController::class, 'index']);

    // Détails d'une inscription
    Route::get('/users-formations/{usersFormation}', [UsersFormationController::class, 'show']);

    Route::get('/mesinscriptions', [UsersFormationController::class, 'myInscriptions']);
    
    Route::get('/formations/{id}/inscriptions', [UsersFormationController::class, 'formationInscriptions']);
    
    // Supprimer une inscription
    Route::delete('/inscriptions/{id}', [UsersFormationController::class, 'destroy']);

    Route::patch('/candidatures/{candidature}/status', [CandidatureController::class, 'updateStatus']);
});

// ------------------------
// Routes publiques
// ------------------------
Route::post('/users-formations/public', [UsersFormationController::class, 'storePublic'])
    ->name('users-formations.public.store')
    ->middleware('throttle:10,1');

// ------------------------
// Webhook FedaPay (public)
// ------------------------
Route::post('/webhook/fedapay', [UsersFormationController::class, 'fedapayWebhook'])
    ->name('webhook.fedapay');

Route::get('/inscription/callback', [UsersFormationController::class, 'callback'])->name('fedapay.callback');

Route::get('/inscription/cancel', [UsersFormationController::class, 'cancel'])->name('fedapay.cancel');

Route::middleware('auth:sanctum')->get('/notifications', function (Request $request) {
    return $request->user()->notifications; // ou ->unreadNotifications
});

// User
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->get('/user', [AuthController::class, 'me']);
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);
Route::middleware('auth:sanctum')->put('/user/profile', [AuthController::class, 'updateProfile']);
Route::middleware('auth:sanctum')->post('/user/document/deletion/{index}', [AuthController::class, 'deleteDocument']);
Route::middleware('auth:sanctum')->delete('/user', [AuthController::class, 'destroy']);

// Categories
Route::apiResource('categories', CategoryController::class)->middleware('auth:sanctum');   
// Offres
// Route::apiResource('offres', OffreController::class)->middleware('auth:sanctum');


//Besoin
Route::post('/besoins', [BesoinController::class, 'store']);
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/besoins', [BesoinController::class, 'index']);
    Route::get('/besoins/{besoin}', [BesoinController::class, 'show']);
    Route::put('/besoins/{besoin}', [BesoinController::class, 'update']);
    Route::delete('/besoins/{besoin}', [BesoinController::class, 'destroy']);

});


Route::get('/blogs', [BlogController::class, 'index']);
Route::get('/blogs/{blog}', [BlogController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/blogs', [BlogController::class, 'store']);
    Route::put('/blogs/{blog}', [BlogController::class, 'update']);
    Route::delete('/blogs/{blog}', [BlogController::class, 'destroy']);
});


Route::middleware(['auth:sanctum', 'is_admin'])->prefix('admin')->group(function () {

    Route::get('/users', [AdminUserController::class, 'index']);
    Route::get('/users/{id}', [AdminUserController::class, 'show']);
    Route::put('/users/{id}/update', [AdminUserController::class, 'update']);
    Route::patch('/users/{id}/status', [AdminUserController::class, 'updateStatus']);
    Route::delete('/users/{id}', [AdminUserController::class, 'destroy']);

});




