<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $productNames = [
            'Inyector Diesel Common Rail',
            'Bomba de Inyección',
            'Tobera de Inyector',
            'Válvula de Control de Presión',
            'Filtro de Combustible',
            'Sensor de Presión de Riel',
            'Juego de Retenes de Inyector',
            'Conjunto de Resortes',
            'Kit de Reparación de Inyector',
            'Cableado para Inyector'
        ];

        return [
            'name' => $this->faker->randomElement($productNames),
            'description' => $this->faker->paragraph(3),
            'price' => $this->faker->randomFloat(2, 50, 5000),
            'actual_stock' => $this->faker->numberBetween(0, 100),
            'min_stock' => $this->faker->numberBetween(5, 20),
        ];
    }
}
