<?php

namespace App\Http\Requests\Update;


use Illuminate\Foundation\Http\FormRequest;

class UpdatePaymentRequest extends FormRequest
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
            'date' => ['date', 'required'],
            'amount' => ['numeric', 'required'],
            'currency' => ['string', 'required', 'min:3'],
            'reference' => ['numeric', 'required', 'min:0'],
            'description' => ['string', 'required', 'max:255'],
            'invoice_id' => ['required', 'integer', 'exists:invoices,id']
        ];
    }
}
