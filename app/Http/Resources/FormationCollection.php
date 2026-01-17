<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class FormationCollection extends ResourceCollection
{
    public function toArray(Request $request): array
    {
        return [
            'data' => FormationResource::collection($this->collection),
        ];
    }
}
