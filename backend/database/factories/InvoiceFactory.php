<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Client;
use App\Models\RegisterClose;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Invoice>
 */
class InvoiceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $types = ['Venta', 'Servicio', 'Mixto'];
        $statuses = ['Pendiente', 'Pagada', 'Cancelada', 'En Proceso'];

        return [
            'date' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'type' => $this->faker->randomElement($types),
            'status' => $this->faker->randomElement($statuses),
            'total_value' => $this->faker->randomFloat(2, 100, 10000),
            'client_id' => Client::factory(),
            'user_id' => User::factory(),
            'register_close_id' => null,
        ];
    }

    public function closed(): static
    {
        return $this->state(function (array $attributes){
            $close = RegisterClose::factory()->create();
        
            return [
                'status' => 'Pagada',
                'register_close_id' => $close->id,
                'date' => $close->date,
            ];
        });
    }
}
