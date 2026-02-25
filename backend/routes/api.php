<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ClientController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\DebtController;
use App\Http\Controllers\Api\InvoiceController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\RegisterCloseController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\SettingController;

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

    Route::get('/dashboard', [DashboardController::class, 'summary']);

    //Rutas de CRUD
    Route::get('/clients/search', [ClientController::class, 'search']);

    Route::apiResource('clients', ClientController::class);
    Route::post("/clients/Like", [ClientController::class, 'indexLike']);

    Route::apiResource('products', ProductController::class);
    Route::post("/products/Like", [ProductController::class, 'indexLike']);

    Route::apiResource('services', ServiceController::class);
    Route::post("/services/Like", [ServiceController::class, 'indexLike']);
    Route::get('/services/{service}/products', [ServiceController::class, 'getProducts']);

    Route::apiResource('payments', PaymentController::class);
    Route::apiResource('debt', DebtController::class);

    Route::apiResource('invoices', InvoiceController::class);
    Route::post('invoices/to_invoice', [InvoiceController::class, 'to_invoice']);

    Route::apiResource('registerClose', RegisterCloseController::class);


    // RUTAS DE CONFIGURACIONES
    Route::get('/settings', [SettingController::class, 'index']);
    Route::post('/settings', [SettingController::class, 'store']);
    Route::get('/settings/{key}', [SettingController::class, 'showByKey']);
    Route::put('/settings/{key}', [SettingController::class, 'updateByKey']);
    Route::patch('/settings/{key}', [SettingController::class, 'updateByKey']);
    Route::delete('/settings/{key}', [SettingController::class, 'destroyByKey']);
    Route::post('/settings/bulk', [SettingController::class, 'bulk']);
    Route::get('/settings/exchange-rates', [SettingController::class, 'getExchangeRates']);

    //Rutas de calculos
    Route::get('clientsInDebt', [ClientController::class, 'clientsInDebt']);
    Route::get('totalDebt', [DebtController::class, 'totalDebt']);
    Route::get('/debtClient/{client}', [DebtController::class, 'debtClient']);

    //Rutas de pagos
    Route::post('/paymentClient', [PaymentController::class, 'paymentClient']);
});
