<?php

declare(strict_types=1);

use App\Enums\FlashMessageKey;
use App\Enums\TenantPermission;
use App\Models\Tag;

use function Pest\Laravel\assertDatabaseCount;
use function Pest\Laravel\from;

describe('if user has permission', function (): void {
    beforeEach(function (): void {
        asUserWithPermission(TenantPermission::MANAGE_SKILLS, TenantPermission::DELETE_SKILLS, TenantPermission::DELETE_REGULAR_TAG);
    });

    it('can be deleted', function (): void {
        $skill = Tag::factory()->skill()->create()->fresh();

        from(route('skills.index'))->delete(route('skills.destroy', ['tag' => $skill]))
            ->assertRedirect(route('skills.index'));

        assertDatabaseCount('tags', 0);

        expect(Tag::find($skill->id))->toBeNull();

    });

    test('can delete a regular skill', function (): void {
        $skill = Tag::factory()->skill()->regular()->create()->fresh();

        from(route('skills.index'))
            ->delete(route('skills.destroy', ['tag' => $skill]))
            ->assertRedirect(route('skills.index'))
            ->assertSessionHas(FlashMessageKey::SUCCESS->value);

        assertDatabaseCount('tags', 0);

        expect(Tag::find($skill->id))->toBeNull();
    });

});

describe('if user does not have permission', function (): void {
    beforeEach(function (): void {
        asUserWithPermission(TenantPermission::MANAGE_SKILLS);
    });

    test('cannot delete a regular skill', function (): void {
        $skill = Tag::factory()->skill()->regular()->create()->fresh();

        from(route('skills.index'))
            ->delete(route('skills.destroy', ['tag' => $skill]))
            ->assertRedirect(route('skills.index'))
            ->assertSessionHas(FlashMessageKey::ERROR->value);

        assertDatabaseCount('tags', 1);

        expect(Tag::find($skill->id))->not()->toBeNull();
    });
});
