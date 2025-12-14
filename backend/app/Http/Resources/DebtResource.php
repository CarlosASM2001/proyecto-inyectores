<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DebtResource extends JsonResource
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
            'client_id' => $this->client_id,
            'invoice_id' => $this->invoice_id,
            'pending_balance' => $this->pending_balance,
            'created_at' => $this->created_at?->format('Y-m-d'),
        ];
    }
}
