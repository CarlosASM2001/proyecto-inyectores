<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Invoice extends Model
{
    use HasFactory;
    protected $table = "invoices";

    public $fillable = [
        "date",
        "type",
        "status",
        "total_value"
    ];

    public function Products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'invoice_product')
                    ->withPivot('unitary_price', 'subtotal', 'quantity')
                    ->withTimestamps();
    }

    public function Services(): BelongsToMany
    {
        return $this->belongsToMany(Service::class, 'invoice_service')
                    ->withPivot('unitary_price', 'subtotal', 'quantity')
                    ->withTimestamps();
    }

    public function Payment(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function Debt(): HasMany
    {
        return $this->hasMany(Debt::class);
    }

    public function Client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function User(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
