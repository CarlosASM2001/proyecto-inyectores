<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Service>
 */
class ServiceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $serviceNames = [
            'Limpieza Ultrasonica de Inyector',
            'Calibración de Inyector',
            'Prueba de Flujo y Patrón',
            'Reemplazo de Toberas',
            'Reparación de Bomba de Inyección',
            'Diagnóstico Computarizado',
            'Mantenimiento Preventivo',
            'Reparación de Common Rail',
            'Cambio de Filtros',
            'Ajuste de Presión'
        ];

        return [
            'name' => $this->faker->randomElement($serviceNames),
            'description' => $this->faker->paragraph(3),
            'base_price' => $this->faker->randomFloat(2, 100, 2000),
        ];
    }
}
