<?php

namespace App\Http\Requests\Store;

use Illuminate\Foundation\Http\FormRequest;

class StoreToInvoiceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'producs' => ['array'],
            'producs.*.id' => ['required', 'integer', 'exists:products,id'],
            'producs.*.quantity' => ['required', 'integer', 'min:1'],
            'producs.*.unitary_price' => ['required', 'numeric', 'min:0'],

            'services' => ['array'],
            'services.*.id' => ['required', 'integer', 'exists:services,id'],
            'services.*.quantity' => ['required', 'integer', 'min:1'],
            'services.*.unitary_price' => ['required', 'numeric', 'min:0'],
            'services.*.products' => ['nullable', 'array'],
            'services.*.products.*.id' => ['required_with:services.*.products', 'integer', 'exists:products,id'],
            'services.*.products.*.quantity' => ['required_with:services.*.products', 'integer', 'min:1'],
            'services.*.products.*.unitary_price' => ['required_with:services.*.products', 'numeric', 'min:0'],

            'id_client' => ['required', 'integer', 'exists:clients,id'],
            'totalPagar' => ['required', 'numeric', 'min:0'],

            'pagos' => ['required', 'array'],
            'pagos.amount' => ['required', 'numeric', 'min:0'],
            'pagos.currency' => ['required', 'string', 'in:Pesos,Dolares,Bolivares'],
            'pagos.reference' => ['required', 'numeric', 'min:0'],

            'user_id' => ['required', 'integer', 'exists:users,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'producs.required' => 'Los productos son requeridos',
            'services.required' => 'Los servicios son requeridos',
            'id_client.required' => 'El cliente es requerido',
            'totalPagar.required' => 'El total a pagar es requerido',
            'pagos.required' => 'La información de pago es requerida',
            'user_id.required' => 'El usuario es requerido',
            'pagos.currency.in' => 'La moneda debe ser Pesos, Dolares o Bolivares',
            'pagos.reference.required' => 'La tasa de cambio es requerida para conversión',
        ];
    }
}
