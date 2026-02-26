<?php

namespace App\Http\Controllers\Api;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Http\Controllers\Controller;
use App\Http\Requests\Store\StoreProductRequest;
use App\Http\Requests\Update\UpdateProductRequest;
use App\Http\Resources\ProductResource;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return ProductResource::collection(Product::all());
    }

    /**
     * Fliteres and inventory listing
     */
    public function inventory(Request $request)
    {
        $query = Product::query();

        if($request->filled('name')){
            $query->where('name','LIKE','%'. $request->name .'%');
        }

        if ($request->filled('status')) {
            match ($request->status) {
                'disponible'  => $query->whereColumn('actual_stock', '>', 'min_stock'),
                'bajo_stock'  => $query->whereColumn('actual_stock', '<=', 'min_stock')->where('actual_stock', '>', 0),
                'agotado'     => $query->where('actual_stock', 0),
                default       => null,
            };
        }


        $perPage = $request->integer('per_page',10);

        return ProductResource::collection($query->orderBy('name')->paginate($perPage));

    }


    /**
     *
     */
    public function indexLike(Request $request)
    {
        return ProductResource::collection(Product::where('name', 'LIKE', '%' . $request->Seach . '%')->take(5)->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductRequest $request)
    {
        $product = Product::create($request->validated());

        return new ProductResource($product);
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        return new ProductResource($product);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductRequest $request, Product $product)
    {
        $product->update($request->validated());

        return new ProductResource($product);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        $product->delete();

        return response()->json([
            'message' => 'El producto ha sido eliminado correctamente',
            Response::HTTP_NO_CONTENT
        ]);
    }
}
