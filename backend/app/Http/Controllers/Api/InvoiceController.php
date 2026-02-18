<?php

namespace App\Http\Controllers\Api;

use App\Models\Invoice;
use App\Models\Product;
use App\Models\Service;
use App\Models\Payment;
use App\Models\Debt;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Http\Requests\Store\StoreInvoiceRequest;
use App\Http\Requests\Store\StoreToInvoiceRequest;
use App\Http\Requests\Update\UpdateInvoiceRequest;
use App\Http\Resources\InvoiceResource;
use Exception;

class InvoiceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // return InvoiceResource::collection(Invoice::query()->orderBy('id', 'desc')->paginate(10));
        return InvoiceResource::collection(Invoice::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreInvoiceRequest $request)
    {
        $invoice = Invoice::create($request->validated());
        return new InvoiceResource($invoice);
    }

    /**
     * Create and process a complete invoice with products, services, payments and debts
     */
    public function to_invoice(StoreToInvoiceRequest $request)
    {
        try {
            return DB::transaction(function () use ($request) {
                // 1. Determine invoice type based on content
                $onlyProducts = count($request->producs) > 0 && count($request->services) == 0;
                $onlyServices = count($request->producs) == 0 && count($request->services) > 0;

                if (count($request->producs) == 0 && count($request->services) == 0) {
                    throw new Exception("La factura debe contener al menos un producto o servicio");
                }

                $invoiceType = $onlyProducts ? 'sale' : ($onlyServices ? 'service' : 'mixed');

                // 2. Create invoice with initial 'pending' status
                $invoice = Invoice::create([
                    'date' => now(),
                    'type' => $invoiceType,
                    'status' => 'pending',
                    'total_value' => $request->totalPagar,
                    'client_id' => $request->id_client,
                    'user_id' => $request->user_id,
                    'register_close_id' => null
                ]);

                // 3. Associate products and update stock
                foreach ($request->producs as $product) {
                    if ($product['quantity'] <= 0) {
                        continue;
                    }

                    // Attach product to invoice
                    $invoice->Products()->attach($product['id'], [
                        'quantity' => $product['quantity'],
                        'unitary_price' => $product['unitary_price'],
                        'subtotal' => $product['quantity'] * $product['unitary_price']
                    ]);

                    // Update product stock
                    $productModel = Product::find($product['id']);
                    if ($productModel->actual_stock >= $product['quantity']) {
                        $productModel->decrement('actual_stock', $product['quantity']);
                    } else {
                        throw new \Exception("Stock insuficiente para el producto " . $product['id']);
                    }
                }

                // 4. Associate services and their products
                foreach ($request->services as $service) {
                    if ($service['quantity'] <= 0) {
                        continue;
                    }

                    $serviceSubtotal = $service['quantity'] * $service['unitary_price'];

                    // Attach service to invoice
                    $invoice->Services()->attach($service['id'], [
                        'quantity' => $service['quantity'],
                        'unitary_price' => $service['unitary_price'],
                        'subtotal' => $serviceSubtotal
                    ]);

                    // Attach service products if exist
                    if (!empty($service['products'])) {
                        foreach ($service['products'] as $product) {
                            if ($product['quantity'] <= 0) {
                                continue;
                            }

                            $invoice->Products()->attach($product['id'], [
                                'quantity' => $product['quantity'],
                                'unitary_price' => $product['unitary_price'],
                                'subtotal' => $product['quantity'] * $product['unitary_price']
                            ]);

                            // Update stock for service products
                            $productModel = Product::find($product['id']);
                            if ($productModel->actual_stock >= $product['quantity']) {
                                $productModel->decrement('actual_stock', $product['quantity']);
                            } else {
                                throw new \Exception("Stock insuficiente para el producto " . $product['id'] . " del servicio");
                            }
                        }
                    }
                }

                // 5. Process payment with currency conversion
                $paymentInCOP = $request->pagos['amount'] / $request->pagos['reference'];
                $totalInCOP = $request->totalPagar;
                $payment = null;
                // Create payment record
                if ($paymentInCOP > 0) {
                    $payment = Payment::create([
                        'date' => now(),
                        'amount' => $request->pagos['amount'],
                        'currency' => $request->pagos['currency'],
                        'reference' => $request->pagos['reference'],
                        'description' => 'Pago de factura en ' . $request->pagos['currency'],
                        'invoice_id' => $invoice->id,
                        'register_close_id' => null
                    ]);
                }

                // 6. Handle debt if payment is less than total
                if (($totalInCOP - $paymentInCOP) > 0.1) {
                    // Convert all amounts to COP for debt calculation
                    $debtAmount = $totalInCOP - $paymentInCOP;

                    // Create debt record
                    Debt::create([
                        'pending_balance' => $debtAmount,
                        'client_id' => $request->id_client,
                        'invoice_id' => $invoice->id
                    ]);

                    // Update invoice status to 'debt'
                    $invoice->update(['status' => 'debt']);
                } else {
                    // Mark invoice as paid
                    $invoice->update(['status' => 'paid']);
                }

                return response()->json([
                    'message' => 'Factura creada y procesada exitosamente',
                    'invoice' => new InvoiceResource($invoice->load(['Products', 'Services', 'Payment', 'Debt']))
                ], 201);
            });
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al procesar la factura',
                'error' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Invoice $invoice)
    {
        return new InvoiceResource($invoice);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateInvoiceRequest $request, Invoice $invoice)
    {
        $invoice->update($request->validated());
        return new InvoiceResource($invoice);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Invoice $invoice)
    {
        $invoice->delete();

        return response()->json([
            'message' => 'La factura ha sido eliminada correctamente',
            Response::HTTP_NO_CONTENT
        ]);
    }
}
