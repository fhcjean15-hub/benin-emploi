<?php

namespace App\Services;

use App\Models\Blog;
use Illuminate\Support\Facades\Storage;

class BlogService
{
    public function create(array $data): Blog
    {
        // Gérer les images si présentes
        if (isset($data['image'])) {
            $uploadedImages = [];
            foreach ($data['image'] as $img) {
                $uploadedImages[] = $img->store('blogs', 'public');
            }
            $data['image'] = $uploadedImages;
        }

        return Blog::create($data);
    }

    public function update(Blog $blog, array $data): Blog
    {
        if (isset($data['image'])) {
            $uploadedImages = [];
            foreach ($data['image'] as $img) {
                $uploadedImages[] = $img->store('blogs', 'public');
            }
            $data['image'] = $uploadedImages;
        }

        $blog->update($data);
        return $blog;
    }

    public function delete(Blog $blog): void
    {
        if ($blog->image) {
            foreach ($blog->image as $img) {
                if (Storage::disk('public')->exists($img)) {
                    Storage::disk('public')->delete($img);
                }
            }
        }

        $blog->delete();
    }
}
