<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Store\StoreRegisterCloseRequest;
use App\Http\Requests\Update\UpdateRegisterCloseRequest;
use App\Http\Resources\RegisterCloseResource;
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
        $data['final_amount'] = $data['COP_amount'] + $data['USD_amount'] + $data['VES_amount'];
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
}
