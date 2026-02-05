<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Store\StoreSettingRequest;
use App\Http\Requests\Update\UpdateSettingRequest;
use App\Http\Resources\SettingResource;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class SettingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $settings = Setting::all();
        return SettingResource::collection($settings);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSettingRequest $request)
    {
        $setting = Setting::create($request->validated());
        return new SettingResource($setting);
    }

    /**
     * Display the specified resource by key.
     */
    public function showByKey($key)
    {
        $setting = Setting::where('key', $key)->firstOrFail();
        return new SettingResource($setting);
    }

    /**
     * Update the specified resource by key in storage.
     */
    public function updateByKey(UpdateSettingRequest $request, $key)
    {
        $setting = Setting::where('key', $key)->firstOrFail();
        $setting->update($request->validated());

        return response()->json([
            'success' => true,
            'data' => new SettingResource($setting),
            'message' => 'Configuración actualizada exitosamente'
        ]);
    }

    /**
     * Remove the specified resource by key from storage.
     */
    public function destroyByKey($key)
    {
        $setting = Setting::where('key', $key)->firstOrFail();
        $setting->delete();

        return response()->json([
            'success' => true,
            'message' => 'Configuración eliminada exitosamente'
        ], Response::HTTP_OK);
    }

    /**
     * Get multiple settings by keys.
     */
    public function bulk(Request $request)
    {
        $validated = $request->validate([
            'keys' => 'required|array',
            'keys.*' => 'string'
        ], [
            'keys.required' => 'El array de claves es requerido.',
            'keys.array' => 'Las claves deben estar en un array.',
            'keys.*.string' => 'Cada clave debe ser una cadena de texto.'
        ]);

        $settings = Setting::whereIn('key', $validated['keys'])->get();

        $response = $settings->map(function ($setting) {
            return [
                'key' => $setting->key,
                'value' => $setting->value,
                'description' => $setting->description
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $response
        ]);
    }

    public function getExchangeRates()
    {
        $rates = [
            'usd' => Setting::getValue('exchange_rate_usd', '0'),
            'ves' => Setting::getValue('exchange_rate_ves', '0'),
            'default' => Setting::getValue('default_currency', 'COP')
        ];

        return response()->json([
            'success' => true,
            'data' => $rates
        ]);
    }

}
