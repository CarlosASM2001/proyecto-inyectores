<?php

namespace App\Http\Requests\Update;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRegisterCloseRequest extends FormRequest
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
            'date' => ['required', 'date'],
            'COP_amount' => ['required', 'numeric', 'min:0'],
            'USD_amount' => ['required', 'numeric', 'min:0'],
            'VES_amount' => ['required', 'numeric', 'min:0'],
            'description' => ['nullable', 'string', 'max:1000']
        ];
    }
}
