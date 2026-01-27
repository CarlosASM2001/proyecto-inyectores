<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RegisterCloseResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // return parent::toArray($request);
        return [
            'id' => $this->id,
            'date' => $this->date,
            'final_amount' => $this->final_amount,
            'COP_amount' => $this->COP_amount,
            'USD_amount' => $this->USD_amount,
            'description' => $this->description
        ];
    }
}
