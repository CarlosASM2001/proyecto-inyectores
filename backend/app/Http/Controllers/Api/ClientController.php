<?php

namespace App\Http\Controllers\Api;

use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Http\Controllers\Controller;
use App\Http\Requests\Store\StoreClientRequest;
use App\Http\Requests\Update\UpdateClientRequest;
use App\Http\Resources\ClientResource;
use App\Models\Debt;

class ClientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return ClientResource::collection(Client::all());
    }

    public function indexLike(Request $request)
    {
        return ClientResource::collection(Client::where('name', 'LIKE', '%' . $request->Seach . '%')
            ->orwhere('cedula', 'LIKE', '%' . $request->Seach . '%')
            ->take(5)->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreClientRequest $request)
    {
        $client = Client::create($request->validated());

        return new ClientResource($client);
    }

    /**
     * Display the specified resource.
     */
    public function show(Client $client)
    {
        return new ClientResource($client);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateClientRequest $request, Client $client)
    {
        $client->update($request->validated());

        return new ClientResource($client);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Client $client)
    {
        $client->delete();

        return response()->json([
            'message' => 'El producto ha sido eliminado correctamente',
            Response::HTTP_NO_CONTENT
        ]);
    }

    public function clientsInDebt()
    {
        $clients = Client::has('debts')->withSum('debts as total_debt', 'pending_balance')->orderBy('total_debt', 'desc')->with('debts')->get();

        return ClientResource::collection($clients);
    }
}
