<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Service;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Obtener todos los productos y servicios existentes
        $products = Product::all();
        $services = Service::all();

        // Verificar que haya productos y servicios para crear relaciones
        if ($products->isEmpty() || $services->isEmpty()) {
            $this->command->info('No hay suficientes productos o servicios para crear relaciones.');
            return;
        }

        // Crear relaciones aleatorias entre productos y servicios
        $services->each(function ($service) use ($products) {
            // Cada servicio tendrá entre 2 y 5 productos asociados
            $productCount = rand(2, 5);
            $selectedProducts = $products->random(min($productCount, $products->count()));

            foreach ($selectedProducts as $product) {
                // Verificar que no exista la relación para evitar duplicados
                DB::table('product_service')->updateOrInsert(
                    [
                        'product_id' => $product->id,
                        'service_id' => $service->id,
                    ],
                    [
                        'quantity' => rand(1, 10), // Cantidad de producto necesario para el servicio
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]
                );
            }
        });
    }
}
