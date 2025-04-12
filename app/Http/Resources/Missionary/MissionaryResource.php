<?php

declare(strict_types=1);

namespace App\Http\Resources\Missionary;

use App\Http\Resources\Address\AddressRelationshipResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Number;

/**
 * @mixin \App\Models\Missionary
 */
final class MissionaryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'lastName' => $this->last_name,
            'email' => $this->email,
            'phone' => $this->phone,
            'gender' => $this->gender->value,
            'church' => $this->church,
            'offering' => Number::format($this->offering, 2),
            'offeringFrequency' => $this->offering_frequency->value,
            'address' => new AddressRelationshipResource($this->whenLoaded('address')),
            'createdAt' => $this->created_at->format('Y-m-d H:i:s'),
            'updatedAt' => $this->updated_at->format('Y-m-d H:i:s'),
            'deletedAt' => $this->deleted_at?->format('Y-m-d H:i:s'),
        ];
    }
}
