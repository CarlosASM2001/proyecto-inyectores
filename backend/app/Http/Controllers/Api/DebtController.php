<?php

namespace App\Http\Controllers\Api;

use App\Models\Debt;
use Illuminate\Http\Response;
use App\Http\Controllers\Controller;
use App\Http\Requests\Store\StoreDebtRequest;
use App\Http\Requests\Update\UpdateDebtRequest;
use App\Http\Resources\DebtResource;


class DebtController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return DebtResource::collection(Debt::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreDebtRequest $request)
    {
        $debt = Debt::create($request->validated());
        return new DebtResource($debt);
    }

    /**
     * Display the specified resource.
     */
    public function show(Debt $debt)
    {
        return new DebtResource($debt);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDebtRequest $request, Debt $debt)
    {
        $debt->update($request->validated());
        return new DebtResource($debt);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Debt $debt)
    {
        $debt->delete();

        return response()->json([
            'message' => 'La deuda ha sido eliminada correctamente',
            Response::HTTP_NO_CONTENT
        ]);
    }
}
