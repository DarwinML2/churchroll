<?php

declare(strict_types=1);

use App\Enums\TenantPermission;
use App\Models\User;
use Tests\RefreshDatabaseWithTenant;
use Tests\TestCase;

/*
|--------------------------------------------------------------------------
| Test Case
|--------------------------------------------------------------------------
|
| The closure you provide to your test functions is always bound to a specific PHPUnit test
| case class. By default, that class is "PHPUnit\Framework\TestCase". Of course, you may
| need to change it using the "pest()" function to bind a different classes or traits.
|
*/

pest()->printer()->compact();
pest()->extend(Tests\TestCase::class)->in('Feature', 'Unit');
pest()->use(RefreshDatabaseWithTenant::class)->in('Feature/**/Tenant', 'Unit/**/Tenant');
/*
|--------------------------------------------------------------------------
| Expectations
|--------------------------------------------------------------------------
|
| When you're writing tests, you often need to check that values meet certain conditions. The
| "expect()" function gives you access to a set of "expectations" methods that you can use
| to assert different things. Of course, you may extend the Expectation API at any time.
|
*/

expect()->extend('toBeOne', fn () => $this->toBe(1));

/*
|--------------------------------------------------------------------------
| Functions
|--------------------------------------------------------------------------
|
| While Pest is very powerful out-of-the-box, you may have some testing code specific to your
| project that you don't want to repeat in every file. Here you can also expose helpers as
| global functions to help you to reduce the number of lines of code in your test files.
|
*/

function asUserWithPermission(TenantPermission ...$permissions): TestCase
{
    test()->seed([
        \Database\Seeders\Tenants\PermissionSeeder::class,
        \Database\Seeders\Tenants\RoleSeeder::class,
    ]);
    $user = User::factory()->create();
    $user->syncPermissions(...$permissions);

    return test()->actingAs($user);
}

function asUserWithoutPermission(): TestCase
{
    $user = User::factory()->create();

    return test()->actingAs($user);
}
