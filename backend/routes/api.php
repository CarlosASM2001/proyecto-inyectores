<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ClientController;
use App\Http\Controllers\Api\DebtController;
use App\Http\Controllers\Api\InvoiceController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ServiceController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/
// --------------------------------------------------------------------------
// 🔓 RUTAS PÚBLICAS (No requieren autenticación)
// --------------------------------------------------------------------------
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);


// --------------------------------------------------------------------------
// 🔒 RUTAS PROTEGIDAS POR SANCTUM (Requieren autenticación)
// --------------------------------------------------------------------------
Route::middleware('auth:sanctum')->group(function () {

    // RUTAS DE AUTENTICACIÓN PROTEGIDAS
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']); // Obtener el usuario autenticado

    // RUTAS CRUD PROTEGIDAS
    // Todas las acciones de estas rutas (index, store, show, update, destroy)
    // ahora requerirán un usuario autenticado.
    Route::apiResource('clients', ClientController::class);
    Route::apiResource('products', ProductController::class);
    Route::apiResource('services', ServiceController::class);
    Route::apiResource('payments', PaymentController::class);
    Route::apiResource('debt', DebtController::class);
    Route::apiResource('invoices', InvoiceController::class);

});
