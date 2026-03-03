<?php

namespace App\Http\Requests\Store;

use Illuminate\Foundation\Http\FormRequest;

class StoreCreateRegisterCloseRequest extends FormRequest
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
            'date' => ['required', 'date', 'after_or_equal:today', 'before_or_equal:today', 'unique:register_close,date'],
            'description' => ['nullable', 'string', 'max:1000']
        ];
    }

    public function messages(): array
    {
        return [
            'date.unique' => 'Ya se creo un cierre de caja para esta fecha',
            'date.after_or_equal' => 'La fecha debe ser hoy',
            'date.before_or_equal' => 'La fecha debe ser hoy',
        ];
    }
}
