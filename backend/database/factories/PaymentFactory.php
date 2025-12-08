<?php

namespace Database\Factories;

use App\Models\Invoice;
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
        $methods = ['Efectivo', 'Transferencia', 'Tarjeta Débito', 'Tarjeta Crédito', 'Pago Móvil'];
        $currencies = ['USD', 'VES', 'EUR'];

        return [
            'date' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'amount' => $this->faker->randomFloat(2, 50, 5000),
            'currency' => $this->faker->randomElement($currencies),
            'reference' => $this->faker->randomFloat(5, 30, 50), // Tasa de cambio USD a VES (30-50 Bs por USD)
            'payment_method' => $this->faker->randomElement($methods),
            'description' => $this->faker->sentence(),
            'invoice_id' => Invoice::factory(),
        ];
    }
}
