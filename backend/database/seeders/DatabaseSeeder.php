<?php

namespace Database\Seeders;

use Database\Seeders\ProductServiceSeeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            InvoiceSeeder::class,
            SettingSeeder::class,
            ProductServiceSeeder::class,
        ]);
    }
}
