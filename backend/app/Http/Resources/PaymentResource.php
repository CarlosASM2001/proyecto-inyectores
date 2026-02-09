<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PaymentResource extends JsonResource
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
            'amount' => $this->amount,
            'currency' => $this->currency,
            'reference' => $this->reference,
            'description' => $this->description,
            'invoice_id' => $this->invoice_id,
            'created_at' => $this->created_at?->format('Y-m-d'),
        ];
    }
}
