<?php

namespace App\Http\Controllers\Api;

use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Http\Controllers\Controller;
use App\Http\Requests\Store\StoreServiceRequest;
use App\Http\Requests\Update\UpdateServiceRequest;
use App\Http\Resources\ServiceResource;
use App\Http\Resources\ProductServiceResource;

class ServiceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return ServiceResource::collection(Service::all());
    }

    public function indexLike(Request $request)
    {
        return ServiceResource::collection(Service::where('name', 'LIKE', '%' . $request->Seach . '%')->take(5)->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreServiceRequest $request)
    {
        $service = Service::create($request->validated());

        // Sincronizar productos si se proporcionan
        if ($request->has('products') && !empty($request->products)) {
            $products = [];
            foreach ($request->products as $product) {
                $products[$product['id']] = ['quantity' => $product['quantity']];
            }
            $service->Productos()->attach($products);
        }

        return new ServiceResource($service);
    }

    /**
     * Display the specified resource.
     */
    public function show(Service $service)
    {
        // Cargar productos del servicio
        $service->load('Productos');

        return new ServiceResource($service);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateServiceRequest $request, Service $service)
    {
        $service->update($request->validated());

        // Sincronizar productos si se proporcionan
        if ($request->has('products')) {
            $products = [];
            foreach ($request->products as $product) {
                $products[$product['id']] = ['quantity' => $product['quantity']];
            }

            if (empty($products)) {
                $service->Productos()->detach();
            } else {
                $service->Productos()->sync($products);
            }
        }

        return new ServiceResource($service);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Service $service)
    {
        $service->delete();

        return response()->json([
            'message' => 'El servicio ha sido eliminado correctamente',
            Response::HTTP_NO_CONTENT
        ]);
    }

    /**
     * Obtener todos los productos asociados a un servicio
     */
    public function getProducts(Service $service)
    {
        return ProductServiceResource::collection($service->Productos()->get());
    }
}
