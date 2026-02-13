<?php

namespace Tests\Feature;

use App\Models\Client;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ClientSearchTest extends TestCase
{
    use RefreshDatabase;

    public function test_search_endpoint_filters_clients_by_search_term_across_name_phone_and_cedula(): void
    {
        Sanctum::actingAs(User::factory()->create());

        $matchByName = Client::factory()->create([
            'name' => 'Andres Perez',
            'phone' => '3001112233',
            'cedula' => '12345678',
        ]);

        $matchByPhone = Client::factory()->create([
            'name' => 'Carlos Ruiz',
            'phone' => '3015557788',
            'cedula' => '87654321',
        ]);

        $matchByCedula = Client::factory()->create([
            'name' => 'Laura Medina',
            'phone' => '3110001122',
            'cedula' => '99887766',
        ]);

        $nonMatching = Client::factory()->create([
            'name' => 'Pedro Casas',
            'phone' => '3201234567',
            'cedula' => '11223344',
        ]);

        $nameResponse = $this->getJson('/api/clients/search?search=andres');
        $phoneResponse = $this->getJson('/api/clients/search?search=301555');
        $cedulaResponse = $this->getJson('/api/clients/search?search=9988');

        $nameResponse->assertOk();
        $phoneResponse->assertOk();
        $cedulaResponse->assertOk();

        $nameIds = collect($nameResponse->json('data'))->pluck('id');
        $phoneIds = collect($phoneResponse->json('data'))->pluck('id');
        $cedulaIds = collect($cedulaResponse->json('data'))->pluck('id');

        $this->assertTrue($nameIds->contains($matchByName->id));
        $this->assertTrue($phoneIds->contains($matchByPhone->id));
        $this->assertTrue($cedulaIds->contains($matchByCedula->id));

        $this->assertFalse($nameIds->contains($nonMatching->id));
        $this->assertFalse($phoneIds->contains($nonMatching->id));
        $this->assertFalse($cedulaIds->contains($nonMatching->id));
    }

    public function test_search_endpoint_respects_limit_when_searching_clients(): void
    {
        Sanctum::actingAs(User::factory()->create());

        Client::factory()->create(['name' => 'Maria Lopez', 'phone' => '3001000001', 'cedula' => '50000001']);
        Client::factory()->create(['name' => 'Mario Diaz', 'phone' => '3001000002', 'cedula' => '50000002']);
        Client::factory()->create(['name' => 'Mariana Rojas', 'phone' => '3001000003', 'cedula' => '50000003']);

        $response = $this->getJson('/api/clients/search?search=mar&limit=2');

        $response->assertOk()
            ->assertJsonCount(2, 'data');
    }

    public function test_index_like_keeps_legacy_seach_parameter_behavior(): void
    {
        Sanctum::actingAs(User::factory()->create());

        $client = Client::factory()->create([
            'name' => 'Natalia Gomez',
            'phone' => '3154009988',
            'cedula' => '77889900',
        ]);

        $legacyResponse = $this->postJson('/api/clients/Like', ['Seach' => 'natalia']);

        $legacyResponse->assertOk();

        $legacyIds = collect($legacyResponse->json('data'))->pluck('id');

        $this->assertTrue($legacyIds->contains($client->id));
    }
}