<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InvoiceResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'date' => $this->date,
            'type' => $this->type,
            'status' => $this->status,
            'total_value' => $this->total_value,
            'client_id' => $this->client_id,
            'user_id' => $this->user_id,
            'created_at' => $this->created_at?->format('Y-m-d'),

            'client' => new ClientResource($this->whenLoaded('Client')),
            'services' => $this->whenLoaded('Services', function () {
                return $this->Services->map(function ($serv) {
                    return [
                        'id' => $serv->id,
                        'name' => $serv->name,
                        'quantity' => $serv->pivot->quantity,
                        'unitary_price' => $serv->pivot->unitary_price,
                        'subtotal' => $serv->pivot->subtotal,
                    ];
                });
            }),
            'products' => $this->whenLoaded('Products', function () {
                return $this->Products->map(function ($prod) {
                    return [
                        'id' => $prod->id,
                        'name' => $prod->name,
                        'quantity' => $prod->pivot->quantity,
                        'unitary_price' => $prod->pivot->unitary_price,
                        'subtotal' => $prod->pivot->subtotal,
                        'service_id' => $prod->pivot->service
                    ];
                });
            }),
            'payments' => PaymentResource::collection($this->whenLoaded('Payment')),
        ];
    }
}
