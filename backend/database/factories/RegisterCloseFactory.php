<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Invoice;
use App\Models\Payment;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\RegisterClose>
 */
class RegisterCloseFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'date' => $this->faker->dateTimeBetween('-1 month', 'now')->format('Y-m-d'),
            // Montos aleatorios por defecto para pruebas rápidas
            'final_amount' => $this->faker->randomFloat(2, 1000, 5000), 
            'COP_amount' => $this->faker->randomFloat(2, 50000, 2000000),
            'USD_amount' => $this->faker->randomFloat(2, 100, 500),
            'VES_amount' => $this->faker->randomFloat(2, 5000, 100000),
            'description' => $this->faker->optional()->sentence(),
            'user_id' => User::factory(),
        ];
    }

    public function calculateFromData(): static
    {
        return $this->state(function (array $attributes) {
            // Buscamos facturas y pagos que no tengan cierre (simulando un cierre real)
            $totalInvoiced = Invoice::whereNull('register_close_id')->sum('total_value');
            $totalCOP = Payment::whereNull('register_close_id')->where('currency', 'COP')->sum('amount');
            $totalUSD = Payment::whereNull('register_close_id')->where('currency', 'USD')->sum('amount');
            $totalVES = Payment::whereNull('register_close_id')->where('currency', 'VES')->sum('amount');

            return [
                'final_amount' => $totalInvoiced,
                'COP_amount' => $totalCOP,
                'USD_amount' => $totalUSD,
                'VES_amount' => $totalVES,
            ];
        });
    }
}
