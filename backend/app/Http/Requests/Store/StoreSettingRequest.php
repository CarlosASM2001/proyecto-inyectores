<?php

namespace App\Http\Requests\Store;

use Illuminate\Foundation\Http\FormRequest;

class StoreSettingRequest extends FormRequest
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
            'key' => 'required|string|max:255|unique:settings,key',
            'value' => 'nullable|string',
            'description' => 'nullable|string'
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'key.required' => 'La clave de configuración es requerida.',
            'key.string' => 'La clave debe ser una cadena de texto.',
            'key.max' => 'La clave no puede exceder 255 caracteres.',
            'key.unique' => 'Ya existe una configuración con esta clave.',
            'value.string' => 'El valor debe ser una cadena de texto.',
            'description.string' => 'La descripción debe ser una cadena de texto.'
        ];
    }
}
