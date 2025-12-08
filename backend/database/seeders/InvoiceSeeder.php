<?php

namespace Database\Seeders;

use App\Models\Client;
use App\Models\Invoice;
use App\Models\Payment;
use App\Models\Debt;
use App\Models\Product;
use App\Models\Service;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class InvoiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear usuarios primero
        User::factory()->create([
            'name' => 'Administrador Principal',
            'email' => 'admin@inyectores.com',
            'password' => bcrypt('password'),
        ]);

        User::factory(3)->create();

        // Crear productos y servicios
        Product::factory(15)->create();
        Service::factory(10)->create();

        // Crear clientes con facturas y relaciones
        Client::factory(20)
            ->has(
                Invoice::factory(3)
                    ->has(Payment::factory(2))
                    ->has(Debt::factory(1))
                    ->afterCreating(function (Invoice $invoice) {
                        // Asignar productos aleatorios a la factura
                        $products = Product::inRandomOrder()->limit(rand(1, 5))->get();
                        foreach ($products as $product) {
                            $quantity = rand(1, 10);
                            $unitaryPrice = $product->price;
                            $subtotal = $quantity * $unitaryPrice;

                            $invoice->products()->attach($product->id, [
                                'unitary_price' => $unitaryPrice,
                                'quantity' => $quantity,
                                'subtotal' => $subtotal,
                            ]);
                        }

                        // Asignar servicios aleatorios a la factura
                        $services = Service::inRandomOrder()->limit(rand(1, 3))->get();
                        foreach ($services as $service) {
                            $quantity = 1; // Los servicios generalmente son unitarios
                            $unitaryPrice = $service->base_price;
                            $subtotal = $quantity * $unitaryPrice;

                            $invoice->services()->attach($service->id, [
                                'unitary_price' => $unitaryPrice,
                                'quantity' => $quantity,
                                'subtotal' => $subtotal,
                            ]);
                        }

                        // Actualizar el total de la factura
                        $totalProducts = $invoice->products->sum('pivot.subtotal');
                        $totalServices = $invoice->services->sum('pivot.subtotal');
                        $invoice->update(['total_value' => $totalProducts + $totalServices]);
                    })
            )
            ->create();

        // Crear algunas facturas adicionales sin deudas para clientes existentes
        Invoice::factory(10)
            ->has(Payment::factory(2))
            ->create();

        // Crear algunas relaciones producto-servicio
        $products = Product::all();
        $services = Service::all();

        foreach ($products->take(5) as $product) {
            $product->services()->attach(
                $services->random(2)->pluck('id')->toArray(),
                ['quantity' => rand(1, 5)]
            );
        }
    }
}
