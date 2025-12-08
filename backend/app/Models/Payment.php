<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    use HasFactory;
    protected $table = "payments";

    public $fillable = [
        "date",
        "amount",
        "currency",
        "reference",
        "payment_method",
        "description"
    ];

    public function Invoice(): BelongsTo
    {
        return $this->belongsTo(Invoice::class);
    }
}
