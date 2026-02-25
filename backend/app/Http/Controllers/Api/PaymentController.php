<?php

namespace App\Http\Controllers\Api;

use App\Models\Payment;
use App\Models\Client;
use Illuminate\Http\Response;
use App\Http\Controllers\Controller;
use App\Http\Requests\Store\StoreClientPaymentRequest;
use App\Http\Resources\PaymentResource;
use App\Http\Requests\Store\StorePaymentRequest;
use App\Http\Requests\Update\UpdatePaymentRequest;
use App\Models\Debt;
use App\Models\Invoice;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Request;

class PaymentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return PaymentResource::collection(Payment::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePaymentRequest $request)
    {
        $payment = Payment::create($request->validated());
        return new PaymentResource($payment);
    }

    /**
     * Display the specified resource.
     */
    public function show(Payment $payment)
    {
        return new PaymentResource($payment);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePaymentRequest $request, Payment $payment)
    {
        $payment->update($request->validated());
        return new PaymentResource($payment);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Payment $payment)
    {
        $payment->delete();

        return response()->json([
            'message' => 'El pago ha sido eliminado correctamente',
            Response::HTTP_NO_CONTENT
        ]);
    }

    public function paymentClient(StoreClientPaymentRequest $request)
    {
        return DB::transaction(function () use ($request) {
            $invoices = Invoice::where('client_id', $request->client_id)
                            ->where('status', '!=', 'Pagada')
                            ->get();
                            
            $payment_amount = $request->amount;

            foreach ($invoices as $invoice) {
                if ($payment_amount <= 0) break; 

                $debt = Debt::where('invoice_id', $invoice->id)->first();
                if (!$debt) continue; 

                $amount_to_pay = min($payment_amount, $debt->pending_balance);

                Payment::create([
                    'date'        => $request->date,
                    'amount'      => $amount_to_pay,
                    'currency'    => $request->currency, 
                    'reference'   => $request->reference, 
                    'description' => $request->description, 
                    'invoice_id'  => $invoice->id
                ]);

                $payment_amount -= $amount_to_pay;

                if ($amount_to_pay == $debt->pending_balance) {
                    $debt->delete();
                    $invoice->update(['status' => 'Pagada']); 
                } else {
                    $debt->decrement('pending_balance', $amount_to_pay);
                }
            }

            return response()->json([
                'Vuelto' => $payment_amount
            ]);
        });
    }
}
