<?php

namespace App\Http\Controllers\Api;

use App\Models\Client;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Http\Controllers\Controller;
use App\Http\Requests\Store\StoreClientRequest;
use App\Http\Requests\Update\UpdateClientRequest;
use App\Http\Resources\ClientResource;

class ClientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = trim((string) $request->query('search', ''));
        $limit = (int) $request->query('limit', 0);
        $limit = $limit > 0 ? min($limit, 200) : 0;

        $clientsQuery = Client::query()->orderBy('name');

        $this->applySearch($clientsQuery, $search);

        if ($limit > 0) {
            $clientsQuery->limit($limit);
        }

        return ClientResource::collection($clientsQuery->get());
    }

    public function indexLike(Request $request)
    {
        $search = trim((string) $request->input('search', $request->input('Seach', '')));
        $limit = (int) $request->input('limit', 5);
        $limit = max(1, min($limit, 50));

        $clientsQuery = Client::query()->orderBy('name');

        $this->applySearch($clientsQuery, $search);

        return ClientResource::collection($clientsQuery->limit($limit)->get());
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

    private function applySearch(Builder $query, string $search): void
    {
        if ($search === '') {
            return;
        }

        $query->where(function (Builder $builder) use ($search) {
            $builder->where('name', 'LIKE', '%' . $search . '%')
                ->orWhere('cedula', 'LIKE', '%' . $search . '%')
                ->orWhere('phone', 'LIKE', '%' . $search . '%');
        });
    }
}
