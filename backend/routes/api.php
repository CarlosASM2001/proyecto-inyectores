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
use App\Http\Controllers\Api\RegisterCloseController;
use App\Http\Controllers\Api\ServiceController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/
// --------------------------------------------------------------------------
// RUTAS PÚBLICAS 
// --------------------------------------------------------------------------
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);


// --------------------------------------------------------------------------
// RUTAS PRIVADAS 
// --------------------------------------------------------------------------
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']); 

    //Rutas de CRUD
    Route::apiResource('clients', ClientController::class);
    Route::apiResource('products', ProductController::class);
    Route::apiResource('services', ServiceController::class);
    Route::apiResource('payments', PaymentController::class);
    Route::apiResource('debt', DebtController::class);
    Route::apiResource('invoices', InvoiceController::class);
    Route::apiResource('registerClose', RegisterCloseController::class);

    //Rutas de calculos 
    Route::get('clientsInDebt', [ClientController::class, 'clientsInDebt']);
    Route::get('totalDebt', [DebtController::class, 'totalDebt']);
});
