<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class CandidatureCollection extends ResourceCollection
{
    public function toArray(Request $request): array
    {
        return [
            'data' => CandidatureResource::collection($this->collection),
        ];
    }
}
