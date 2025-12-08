<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class Product extends Model
{
    use HasFactory;

    protected $table = "products";

    public $fillable = [
        "name",
        "description",
        "price",
        "actual_stock",
        "min_stock"
    ];

    public function Services(): BelongsToMany
    {
        return $this->belongsToMany(Service::class, "product_service", "product_id", "service_id")
            ->withPivot("quantity");
    }
}
