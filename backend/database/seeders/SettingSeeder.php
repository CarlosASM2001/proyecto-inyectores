<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            [
                'key' => 'exchange_rate_usd',
                'value' => '3.700',
                'description' => 'Tipo de cambio COP a USD'
            ],
            [
                'key' => 'exchange_rate_ves',
                'value' => '0.007',
                'description' => 'Tipo de cambio COP a VES'
            ],
            [
                'key' => 'default_currency',
                'value' => 'COP',
                'description' => 'Moneda base del sistema'
            ],
            [
                'key' => 'iva_rate',
                'value' => '0.12',
                'description' => 'Tasa de IVA'
            ],
            [
                'key' => 'company_name',
                'value' => 'Inyectores S.A.S',
                'description' => 'Nombre de la empresa'
            ],
            [
                'key' => 'company_phone',
                'value' => '+57 310 123 4567',
                'description' => 'Teléfono de contacto de la empresa'
            ],
            [
                'key' => 'company_email',
                'value' => 'contacto@inyectores.com',
                'description' => 'Email de contacto de la empresa'
            ],
            [
                'key' => 'company_address',
                'value' => 'Calle 123 # 45-67',
                'description' => 'Dirección de la empresa'
            ]
        ];

        foreach ($settings as $setting) {
            Setting::create($setting);
        }
    }
}
