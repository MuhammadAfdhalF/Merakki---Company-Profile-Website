<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\HomeSection;
use Illuminate\Http\Request;

class HomeSectionController extends Controller
{
    /**
     * GET /api/home-sections
     */
    public function index(Request $request)
    {
        $query = HomeSection::query();

        // Optional filter
        if ($request->filled('is_active')) {
            $isActive = filter_var($request->input('is_active'), FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
            if (!is_null($isActive)) {
                $query->where('is_active', $isActive);
            }
        }

        $data = $query->orderBy('order')->orderBy('id', 'desc')->get();

        return response()->json([
            'data' => $data,
        ]);
    }

    /**
     * POST /api/home-sections
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:200'],
            'background_image' => ['required', 'string', 'max:255'], // path from /upload
            'order' => ['sometimes', 'integer', 'min:0'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $data['order'] = $data['order'] ?? 0;
        $data['is_active'] = $data['is_active'] ?? true;

        $homeSection = HomeSection::create($data);

        return response()->json([
            'message' => 'Home section created',
            'data' => $homeSection,
        ], 201);
    }

    /**
     * GET /api/home-sections/{id}
     */
    public function show(string $id)
    {
        $homeSection = HomeSection::findOrFail($id);

        return response()->json([
            'data' => $homeSection,
        ]);
    }

    /**
     * PATCH/PUT /api/home-sections/{id}
     */
    public function update(Request $request, string $id)
    {
        $homeSection = HomeSection::findOrFail($id);

        $data = $request->validate([
            'title' => ['sometimes', 'string', 'max:200'],
            'background_image' => ['sometimes', 'string', 'max:255'],
            'order' => ['sometimes', 'integer', 'min:0'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $homeSection->update($data);

        return response()->json([
            'message' => 'Home section updated',
            'data' => $homeSection->fresh(),
        ]);
    }

    /**
     * DELETE /api/home-sections/{id}
     */
    public function destroy(string $id)
    {
        $homeSection = HomeSection::findOrFail($id);
        $homeSection->delete();

        return response()->json([
            'message' => 'Home section deleted',
        ]);
    }
}
