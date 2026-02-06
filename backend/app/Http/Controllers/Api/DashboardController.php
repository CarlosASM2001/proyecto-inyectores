<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ClientResource;
use App\Http\Resources\InvoiceResource;
use App\Http\Resources\ProductResource;
use App\Models\Client;
use App\Models\Debt;
use App\Models\Invoice;
use App\Models\Product;
use Carbon\Carbon;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function summary(Request $request)
    {
        $startOfMonth = Carbon::now()->startOfMonth()->startOfDay();

        $newCustomers = Client::where('created_at', '>=', $startOfMonth)->count();
        $monthlyInvoices = Invoice::whereDate('date', '>=', $startOfMonth->toDateString())->count();
        $totalDebts = Debt::sum('pending_balance');
        $lowStockCount = Product::whereColumn('actual_stock', '<=', 'min_stock')->count();

        $latestCustomers = array_values(
            ClientResource::collection(
                Client::orderByDesc('id')->limit(4)->get()
            )->toArray($request)
        );
        $recentInvoices = array_values(
            InvoiceResource::collection(
                Invoice::orderByDesc('id')->limit(5)->get()
            )->toArray($request)
        );
        $lowStockList = array_values(
            ProductResource::collection(
                Product::whereColumn('actual_stock', '<=', 'min_stock')
                    ->orderBy('actual_stock', 'asc')
                    ->limit(3)
                    ->get()
            )->toArray($request)
        );

        $topDebts = Debt::with('Client')
            ->orderByDesc('pending_balance')
            ->limit(3)
            ->get()
            ->map(function ($debt) {
                return [
                    'id' => $debt->id,
                    'client_id' => $debt->client_id,
                    'client_name' => $debt->Client?->name ?? 'Cliente',
                    'pending_balance' => $debt->pending_balance,
                    'created_at' => $debt->created_at?->format('Y-m-d'),
                ];
            })
            ->values()
            ->all();

        return response()->json([
            'data' => [
                'newCustomers' => $newCustomers,
                'monthlyInvoices' => $monthlyInvoices,
                'totalDebts' => $totalDebts,
                'lowStockCount' => $lowStockCount,
                'latestCustomers' => $latestCustomers,
                'recentInvoices' => $recentInvoices,
                'topDebts' => $topDebts,
                'lowStockList' => $lowStockList,
            ],
        ]);
    }
}
