<?php

declare(strict_types=1);

use App\Enums\FlashMessageKey;
use App\Enums\TenantPermission;
use App\Enums\TenantRole;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

use function Pest\Laravel\from;
use function Pest\Laravel\get;

it('cannot be rendered if not authenticated', function (): void {
    get(route('users.edit', ['user' => User::factory()->create()]))
        ->assertRedirect(route('login'));
});

describe('if user has permission', function (): void {
    beforeEach(function (): void {
        asUserWithPermission(TenantPermission::MANAGE_USERS, TenantPermission::UPDATE_USERS);
        $this->travel(1)->days();
    });

    it('can be rendered if authenticated', function (): void {
        $user = User::factory()->create();

        get(route('users.edit', ['user' => $user]))
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page): Assert => $page
                ->component('users/edit')
                ->has('permissions')
                ->has('roles')
            );

    });

    it('can be updated', function (): void {
        $user = User::factory()->create();
        from(route('users.edit', ['user' => $user]))
            ->put(route('users.update', ['user' => $user]), [
                'name' => 'John',
                'email' => 'john.doe@example.com',
                'password' => 'password',
                'password_confirmation' => 'password',
                'roles' => [TenantRole::SECRETARY->value],
                'additional_permissions' => [TenantPermission::MANAGE_USERS->value],
            ])
            ->assertSessionDoesntHaveErrors()
            ->assertRedirect(route('users.index'));

        $user = $user->refresh();

        expect($user)->not->toBeNull()
            ->and($user->name)->toBe('John')
            ->and($user->email)->toBe('john.doe@example.com')
            ->and($user->hasRole(TenantRole::SECRETARY))->toBeTrue()
            ->and($user->hasDirectPermission(TenantPermission::MANAGE_USERS))->toBeTrue();
    });

    it('can be updated without additional permissions', function (): void {

        $user = User::factory()->create();
        from(route('users.edit', ['user' => $user]))
            ->put(route('users.update', ['user' => $user]), [
                'name' => 'John',
                'email' => 'john.doe@example.com',
                'password' => 'password',
                'password_confirmation' => 'password',
                'roles' => [TenantRole::SECRETARY->value],
                'additional_permissions' => [],
            ])
            ->assertSessionDoesntHaveErrors()
            ->assertRedirect(route('users.index'));

        $user = $user->refresh();

        expect($user)->not->toBeNull()
            ->and($user->name)->toBe('John')
            ->and($user->email)->toBe('john.doe@example.com')
            ->and($user->hasRole(TenantRole::SECRETARY))->toBeTrue()
            ->and($user->permissions()->count())->toBe(0);

    });

});

describe('if user does not have permission', function (): void {
    beforeEach(function (): void {
        asUserWithPermission(TenantPermission::MANAGE_USERS);
    });

    it('cannot be rendered if authenticated', function (): void {
        get(route('users.edit', ['user' => User::factory()->create()]))
            ->assertRedirect(route('users.index'))
            ->assertSessionHas(FlashMessageKey::ERROR->value);
    });

    it('cannot be updated', function (): void {
        $user = User::factory()->create();

        from(route('users.edit', ['user' => $user]))
            ->put(route('users.update', ['user' => $user]), [
                'name' => 'John',
                'email' => 'john.doe@example.com',
                'password' => 'password',
                'password_confirmation' => 'password',
                'roles' => [TenantRole::SECRETARY->value],
                'additional_permissions' => [TenantPermission::MANAGE_USERS->value],
            ])
            ->assertRedirect(route('users.index'))
            ->assertSessionHas(FlashMessageKey::ERROR->value);
    });
});
