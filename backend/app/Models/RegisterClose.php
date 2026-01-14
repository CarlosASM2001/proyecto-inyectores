<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class RegisterClose extends Model
{
    use HasFactory;
    protected $table = "register_close";

    public $fillable = [
        'date',
        'final_amount',
        'COP_amount',
        'USD_amount',
        'description',
        'user_id'
    ];

    protected $casts = [
        'date' => 'date',
        'final_amount' => 'decimal:2',
        'COP_amount' => 'decimal:2',
        'USD_amount' => 'decimal:2',
    ];

    public function User() : BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function Invoice() : HasMany
    {
        return $this->hasMany(Invoice::class, 'register_close_id');
    }

    public function Payment () : HasMany 
    {
        return $this->hasMany(Payment::class, 'register_close_id');
    }
}
