<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $table = "settings";

    protected $fillable = [
        'key',
        'value',
        'description'
    ];

    public static function getValue(string $key, $default = null)
    {
        $setting = static::where('key', $key)->first();
        return $setting ? $setting->value : $default;
    }

    public static function setValue(string $key, $value, string $description = null)
    {
        return static::updateOrCreate(
            ['key' => $key],
            ['value' => $value, 'description' => $description]
        );
    }

    public static function getMany(array $keys)
    {
        return static::whereIn('key', $keys)->get();
    }

    public function getExchangeRates()
    {
        return [
            'usd' => $this->getValue('exchange_rate_usd', 0),
            'ves' => $this->getValue('exchange_rate_ves', 0),
            'default' => $this->getValue('default_currency', 'COP')
        ];
    }

}
