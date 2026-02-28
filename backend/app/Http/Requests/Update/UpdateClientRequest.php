<?php

namespace App\Http\Requests\Update;

use Illuminate\Foundation\Http\FormRequest;

class UpdateClientRequest extends FormRequest
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
        $id = $this->route('client');

        return [
            'name'   => ['required', 'string', 'max:255', 'min:10'],
            'phone'  => ['nullable', 'string', 'max:20', 'min:11', 'regex:/^[0-9- +()]*$/'],
            'cedula' => ['required', 'string', 'max:20', 'min:7'],
        ];
    }
}
