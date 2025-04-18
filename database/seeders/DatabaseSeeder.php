<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Church;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Artisan;

final class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        $church = Church::create([
            'name' => 'Test Church',
        ]);
        $church->createDomain('tenant1');

        Artisan::call('tenants:seed', [
            '--tenants' => [$church->id],
        ]);
    }
}
