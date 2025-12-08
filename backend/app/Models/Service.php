<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Service extends Model
{
    use HasFactory;
    
    protected $table = "services";

    public $fillable = [
        "name",
        "description",
        "base_price"
    ];

    public function Productos(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, "product_service", "service_id", "product_id")
            ->withPivot("quantity");;
    }
}
