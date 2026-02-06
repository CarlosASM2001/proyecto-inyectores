<?php

namespace Database\Factories;

use App\Models\Invoice;
use App\Models\RegisterClose;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Payment>
 */
class PaymentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $currencies = ['USD', 'VES', 'COP'];

        return [
            'date' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'amount' => $this->faker->randomFloat(2, 50, 5000),
            'currency' => $this->faker->randomElement($currencies),
            'reference' => $this->faker->randomFloat(5, 30, 50), // Tasa de cambio USD a VES (30-50 Bs por USD)
            'description' => $this->faker->sentence(),
            'invoice_id' => Invoice::factory(),
            'register_close_id' => RegisterClose::factory(),
        ];
    }

    public function closed(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'register_close_id' => RegisterClose::factory(),
                
                'date' => function (array $attributes) {
                    return RegisterClose::find($attributes['register_close_id'])->date;
                },
            ];
        });
    }
}
