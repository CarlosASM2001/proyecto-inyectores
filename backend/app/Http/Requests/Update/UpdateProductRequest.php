<?php

namespace App\Http\Requests\Update;


use Illuminate\Foundation\Http\FormRequest;

class UpdateProductRequest extends FormRequest
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
            'name' => ['string', 'required', "max:100"],
            'description' => ['string', 'nullable', "max:500"],
            'price' => ['numeric', 'required', 'min:0'],
            'actual_stock' => ['numeric', 'required', 'min:0'],
            'min_stock' => ['numeric', 'required', 'min:0']
        ];
    }
}
