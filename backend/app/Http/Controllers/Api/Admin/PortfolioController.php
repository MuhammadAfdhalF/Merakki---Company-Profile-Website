<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Portfolio;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class PortfolioController extends Controller
{
    /**
     * GET /api/portfolios
     * Admin list portfolios (optionally can be extended with filters later)
     */
    // public function index(Request $request)
    // {
    //     $query = Portfolio::query();

    //     // Optional filters (safe + useful for admin dashboard)
    //     if ($request->filled('category')) {
    //         $query->where('category', $request->input('category'));
    //     }

    //     if ($request->filled('is_active')) {
    //         $isActive = filter_var($request->input('is_active'), FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
    //         if (!is_null($isActive)) {
    //             $query->where('is_active', $isActive);
    //         }
    //     }

    //     if ($request->filled('is_featured')) {
    //         $isFeatured = filter_var($request->input('is_featured'), FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
    //         if (!is_null($isFeatured)) {
    //             $query->where('is_featured', $isFeatured);
    //         }
    //     }

    //     if ($request->filled('q')) {
    //         $q = $request->input('q');
    //         $query->where(function ($sub) use ($q) {
    //             $sub->where('title', 'like', "%{$q}%")
    //                 ->orWhere('slug', 'like', "%{$q}%");
    //         });
    //     }

    //     $portfolios = $query->orderBy('order')->orderBy('id', 'desc')->get();

    //     return response()->json([
    //         'data' => $portfolios,
    //     ]);
    // }

    public function index(Request $request)
    {
        $query = \App\Models\Portfolio::query();

        // optional: category filter
        $category = $request->query('category');
        if ($category && $category !== 'all') {
            $query->where('category', $category);
        }

        // optional: search (kalau mau sekalian)
        $q = $request->query('q');
        if ($q) {
            $query->where(function ($w) use ($q) {
                $w->where('title', 'like', "%{$q}%")
                    ->orWhere('slug', 'like', "%{$q}%");
            });
        }

        // sort default by order
        $items = $query->orderBy('order')->latest('id')->get();

        return response()->json([
            'data' => $items
        ]);
    }

    /**
     * POST /api/portfolios
     * Create portfolio (media is REQUIRED, min 1)
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:200'],
            'slug' => ['required', 'string', 'max:220', 'unique:portfolios,slug'],
            'description' => ['nullable', 'string'],
            'category' => ['required', Rule::in(['design', 'photography', 'video', 'branding'])],

            'media' => ['required', 'array', 'min:1'],
            'media.*.type' => ['required', Rule::in(['image', 'video', 'pdf'])],
            'media.*.path' => ['required', 'string', 'max:255'],

            'is_featured' => ['sometimes', 'boolean'],
            'order' => ['sometimes', 'integer', 'min:0'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        // Defaults (match DB defaults, but keep predictable)
        $data['is_featured'] = $data['is_featured'] ?? false;
        $data['order'] = $data['order'] ?? 0;
        $data['is_active'] = $data['is_active'] ?? true;

        $portfolio = Portfolio::create($data);

        return response()->json([
            'message' => 'Portfolio created',
            'data' => $portfolio,
        ], 201);
    }

    /**
     * GET /api/portfolios/{id}
     * Admin detail by id
     */
    public function show(string $id)
    {
        $portfolio = Portfolio::findOrFail($id);

        return response()->json([
            'data' => $portfolio,
        ]);
    }

    /**
     * PATCH/PUT /api/portfolios/{id}
     * Update portfolio.
     * If "media" is sent -> REPLACE total and must be min:1
     */
    public function update(Request $request, string $id)
    {
        $portfolio = Portfolio::findOrFail($id);

        $rules = [
            'title' => ['sometimes', 'string', 'max:200'],
            'slug' => ['sometimes', 'string', 'max:220', Rule::unique('portfolios', 'slug')->ignore($portfolio->id)],
            'description' => ['nullable', 'string'],
            'category' => ['sometimes', Rule::in(['design', 'photography', 'video', 'branding'])],

            'is_featured' => ['sometimes', 'boolean'],
            'order' => ['sometimes', 'integer', 'min:0'],
            'is_active' => ['sometimes', 'boolean'],
        ];

        // media is optional on update, but if present => must be valid and min 1
        if ($request->has('media')) {
            $rules['media'] = ['required', 'array', 'min:1'];
            $rules['media.*.type'] = ['required', Rule::in(['image', 'video', 'pdf'])];
            $rules['media.*.path'] = ['required', 'string', 'max:255'];
        }

        $data = $request->validate($rules);

        // If media not provided, keep existing media unchanged
        $portfolio->update($data);

        return response()->json([
            'message' => 'Portfolio updated',
            'data' => $portfolio->fresh(),
        ]);
    }

    /**
     * DELETE /api/portfolios/{id}
     * Delete portfolio
     */
    public function destroy(string $id)
    {
        $portfolio = Portfolio::findOrFail($id);
        $portfolio->delete();

        return response()->json([
            'message' => 'Portfolio deleted',
        ]);
    }
}
