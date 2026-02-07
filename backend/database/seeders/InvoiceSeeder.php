<?php

namespace Database\Seeders;

use App\Models\Client;
use App\Models\Invoice;
use App\Models\Payment;
use App\Models\Debt;
use App\Models\Product;
use App\Models\Service;
use App\Models\User;
use App\Models\RegisterClose;
use Illuminate\Database\Seeder;

class InvoiceSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::factory()->create([
            'name' => 'Administrador Principal',
            'email' => 'admin@inyectores.com',
            'password' => bcrypt('password'),
        ]);

        Product::factory(15)->create();
        Service::factory(10)->create();
        Client::factory(20)->create();

        for ($i = 5; $i >= 0; $i--) {
            $fecha = now()->subDays($i);

            $cierre = RegisterClose::factory()->create([
                'date' => $fecha->format('Y-m-d'),
                'user_id' => $admin->id,
            ]);

            Invoice::factory(4)->create([
                'date' => $fecha->format('Y-m-d'),
                'register_close_id' => $cierre->id,
                'user_id' => $admin->id,
                'client_id' => Client::all()->random()->id,
            ])->each(function (Invoice $invoice) use ($fecha, $cierre) {

                $this->attachItems($invoice);

                $suerte = rand(1, 100);

                if ($suerte > 75) {
                    $invoice->update(['status' => 'Pendiente']);
                    Debt::factory()->create(['invoice_id' => $invoice->id]);
                } elseif ($suerte > 45) {
                    Payment::factory()->create();
                    $invoice->update(['status' => 'En Proceso']);
                } else {
                    Payment::factory()->create();
                    $invoice->update(['status' => 'Pagada']);
                }
            });

            $cierre->update([
                'final_amount' => Invoice::where('register_close_id', $cierre->id)->sum('total_value'),
                'COP_amount' => Payment::where('register_close_id', $cierre->id)->where('currency', 'COP')->sum('amount'),
                'USD_amount' => Payment::where('register_close_id', $cierre->id)->where('currency', 'USD')->sum('amount'),
                'VES_amount' => Payment::where('register_close_id', $cierre->id)->where('currency', 'VES')->sum('amount'),
            ]);
        }
    }

    private function attachItems(Invoice $invoice)
    {
        $products = Product::inRandomOrder()->limit(rand(1, 3))->get();
        foreach ($products as $product) {
            $qty = rand(1, 4);
            $invoice->products()->attach($product->id, [
                'unitary_price' => $product->price,
                'quantity' => $qty,
                'subtotal' => $product->price * $qty,
            ]);
        }

        $services = Service::inRandomOrder()->limit(rand(1, 2))->get();
        foreach ($services as $service) {
            $invoice->services()->attach($service->id, [
                'unitary_price' => $service->base_price,
                'quantity' => 1,
                'subtotal' => $service->base_price,
            ]);
        }

        // Recalcular total de la factura sumando ambas relaciones
        $totalProducts = $invoice->products->sum('pivot.subtotal');
        $totalServices = $invoice->services->sum('pivot.subtotal');

        $invoice->update(['total_value' => $totalProducts + $totalServices]);
    }
}
