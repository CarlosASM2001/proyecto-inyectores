<?php

namespace App\Http\Requests\Update;

use Illuminate\Foundation\Http\FormRequest;

class UpdateServiceRequest extends FormRequest
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
            'name' => ['string', 'required', 'max:100'],
            'description' => ['string', 'required', 'max:500'],
            'base_price' => ['numeric', 'required', 'min:0'],
            'products' => ['array', 'nullable'],
            'products.*.id' => ['integer', 'exists:products,id'],
            'products.*.quantity' => ['integer', 'required_with:products', 'min:1', 'max:9999'],
        ];
    }
}
