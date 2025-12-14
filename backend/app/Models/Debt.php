<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Debt extends Model
{
    use HasFactory;
    protected $table = "debts";

    public $fillable = [
        "pending_balance",
        "client_id",
        "invoice_id"
    ];

    public function Client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function Invoice(): BelongsTo
    {
        return $this->belongsTo(Invoice::class);
    }
}
