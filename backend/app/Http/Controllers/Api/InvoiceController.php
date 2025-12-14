<?php

namespace App\Http\Controllers\Api;

use App\Models\Invoice;
use Illuminate\Http\Response;
use App\Http\Controllers\Controller;
use App\Http\Requests\Store\StoreInvoiceRequest;
use App\Http\Requests\Update\UpdateInvoiceRequest;
use App\Http\Resources\InvoiceResource;

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
