<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Store\StoreCreateRegisterCloseRequest;
use App\Http\Requests\Store\StoreRegisterCloseRequest;
use App\Http\Requests\Update\UpdateRegisterCloseRequest;
use App\Http\Resources\RegisterCloseResource;
use App\Models\Payment;
use App\Models\RegisterClose;
use Illuminate\Http\Response;

class RegisterCloseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return RegisterCloseResource::collection(RegisterClose::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRegisterCloseRequest $request)
    {
        $data = $request->validated();
        $data['final_amount'] = $data['USD_amount'] + $data['USD_amount'] + $data['VES_amount'];
        $data['user_id'] = $request->user()->id;

        $registerClose = RegisterClose::create($data);
        
        return new RegisterCloseResource($registerClose);
    }

    /**
     * Display the specified resource.
     */
    public function show(RegisterClose $registerClose)
    {
        return new RegisterCloseResource($registerClose);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRegisterCloseRequest $request, RegisterClose $registerClose)
    {
        $data = $request->validated();
        $data['final_amount'] = $data['COP_amount'] + $data['USD_amount'] + $data['VES_amount'];
        
        $registerClose->update($data);

        return new RegisterCloseResource($registerClose);
    }

    /**
     * MAXIMO CUIDADO CON BORRAR UN CIERRE DE CAJA YA QUE IMPLICARIA PERDIDA Y DESCONTROL. PENSAR SERIAMENTE SI DEJAR EN EL PROGRAMA FINAL.
     */
    public function destroy(RegisterClose $registerClose)
    {
        $registerClose->delete();

        return response()->json([
            'message' => 'El cierre de caja ha sido eliminado',
            Response::HTTP_NO_CONTENT
        ]);
    }

    public function createRegisterClose(StoreCreateRegisterCloseRequest $request)
    {
        $data = $request->validated();
        $pagos = Payment::where('date', $data['date'])->get();

        $VES_amount=0;
        $USD_amount=0;
        $COP_amount=0;

        if($data){
            $registerClose = RegisterClose::create([
                'date' => $data['date'],
                'final_amount' => 0,
                'COP_amount' => 0,
                'USD_amount' => 0,
                'VES_amount' => 0,
                'description' => $data['description'],
                'user_id' => auth()->id(),
            ]);
        }

        foreach($pagos as $pago){
            if($pago->currency == 'USD') $USD_amount+=$pago->amount;
            else if($pago->currency === 'VES') $VES_amount+=$pago->amount;
            else $COP_amount+=$pago->amount;

            $pago->register_close_id = $registerClose->id;
            $pago->save();
        }

        $registerClose->COP_amount = $COP_amount;
        $registerClose->VES_amount = $VES_amount;
        $registerClose->USD_amount = $USD_amount;

        $registerClose->save();
    }
}
