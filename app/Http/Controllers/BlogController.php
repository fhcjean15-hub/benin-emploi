<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Resources\BlogResource;
use App\Models\Blog;
use App\Services\BlogService;
use Illuminate\Http\Request;

class BlogController extends Controller
{
    public function __construct(private BlogService $service) {}

    public function index()
    {
        $blogs = Blog::latest()->paginate(10);
        return BlogResource::collection($blogs);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'titre' => 'required|string|max:255',
            'contenu' => 'required|string',
            'image'             => 'nullable|array',
            'image.*'           => 'nullable|image|max:5120',
        ]);

        $blog = $this->service->create($validated);

        return response()->json([
            'message' => 'Blog créé avec succès',
            'data' => new BlogResource($blog)
        ], 201);
    }

    public function show(Blog $blog)
    {
        return new BlogResource($blog);
    }

    public function update(Request $request, Blog $blog)
    {
        $validated = $request->validate([
            'titre' => 'sometimes|string|max:255',
            'contenu' => 'sometimes|string',
            'image'   => 'nullable|array',
            'image.*' => 'nullable|image|max:5120',
        ]);

        $blog = $this->service->update($blog, $validated);

        return response()->json([
            'message' => 'Blog mis à jour',
            'data' => new BlogResource($blog)
        ]);
    }

    public function destroy(Blog $blog)
    {
        $this->service->delete($blog);
        return response()->json(['message' => 'Blog supprimé']);
    }
}
