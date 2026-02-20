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
use Illuminate\Support\Facades\DB;

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

        $invoices = Invoice::factory(4)->create([
            'date' => $fecha->format('Y-m-d'),
            'register_close_id' => $cierre->id,
            'user_id' => $admin->id,
            'client_id' => Client::all()->random()->id,
        ]);

        $invoices->each(function ($invoice) use ($fecha, $cierre) {
            $this->attachItems($invoice);

            if (rand(1, 100) > 50) {
                $invoice->update(['status' => 'Pendiente']);
                Debt::factory()->create(['invoice_id' => $invoice->id]);
            } else {
                $invoice->update(['status' => 'Pagada']);
                Payment::factory()->create([
                    'invoice_id' => $invoice->id,
                    'register_close_id' => $cierre->id
                ]);
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
        $services = Service::inRandomOrder()->limit(rand(1, 2))->get();
        $attachedProductIds = [];
        $totalProductSubtotal = 0;
        $totalServiceSubtotal = 0;

        // 1. Attach services and their products
        foreach ($services as $service) {
            $serviceQty = rand(1, 3);
            $serviceSubtotal = $serviceQty * $service->base_price;

            $invoice->services()->attach($service->id, [
                'unitary_price' => $service->base_price,
                'quantity' => $serviceQty,
                'subtotal' => $serviceSubtotal,
            ]);

            $totalServiceSubtotal += $serviceSubtotal;

            // Get service products to attach to invoice
            $serviceProducts = DB::table('product_service')
                ->where('service_id', $service->id)
                ->get();

            foreach ($serviceProducts as $serviceProduct) {
                $product = Product::find($serviceProduct->product_id);
                if ($product) {
                    $productQty = $serviceQty * $serviceProduct->quantity;
                    $productSubtotal = $productQty * $product->price;

                    // Use service_id in service to prevent duplicate key conflicts
                    $sourceType = 'service_' . $service->id;

                    $invoice->products()->attach($product->id, [
                        'unitary_price' => $product->price,
                        'quantity' => $productQty,
                        'subtotal' => $productSubtotal,
                        'service' => $sourceType,
                    ]);

                    $attachedProductIds[] = $product->id;
                    $totalProductSubtotal += $productSubtotal;
                }
            }
        }

        // 2. Attach direct products (avoiding duplicates with service products)
        $availableProducts = Product::whereNotIn('id', $attachedProductIds)->inRandomOrder()->limit(rand(0, 2))->get();

        foreach ($availableProducts as $product) {
            $qty = rand(1, 4);
            $subtotal = $product->price * $qty;

            $invoice->products()->attach($product->id, [
                'unitary_price' => $product->price,
                'quantity' => $qty,
                'subtotal' => $subtotal,
            ]);

            $totalProductSubtotal += $subtotal;
        }

        // 3. Calculate total invoice value
        $totalInvoiceValue = $totalProductSubtotal + $totalServiceSubtotal;
        $invoice->update(['total_value' => $totalInvoiceValue]);
        $services = Service::inRandomOrder()->limit(rand(1, 2))->get();
        foreach ($services as $service) {
            $invoice->services()->attach($service->id, [
                'unitary_price' => $service->base_price,
                'quantity' => 1,
                'subtotal' => $service->base_price,
            ]);
        }

        $totalProducts = $invoice->products->sum('pivot.subtotal');
        $totalServices = $invoice->services->sum('pivot.subtotal');

        $invoice->update(['total_value' => $totalProducts + $totalServices]);
    }
}
