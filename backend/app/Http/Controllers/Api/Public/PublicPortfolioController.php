<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Models\Portfolio;
use Illuminate\Http\Request;

class PublicPortfolioController extends Controller
{
    // GET /api/public/portfolios?category=design&featured=1
    // public function index(Request $request)
    // {
    //     $query = Portfolio::query()
    //         ->where('is_active', true);

    //     // category filter (optional)
    //     if ($request->filled('category')) {
    //         $query->where('category', $request->input('category'));
    //     }

    //     // featured filter (optional): featured=1 / featured=true / featured=false
    //     if ($request->filled('featured')) {
    //         $featured = filter_var($request->input('featured'), FILTER_VALIDATE_BOOLEAN);
    //         $query->where('is_featured', $featured);
    //     }

    //     $portfolios = $query->orderBy('order')->get();

    //     return response()->json([
    //         'data' => $portfolios,
    //     ]);
    // }

    public function index(Request $request)
    {
        $query = \App\Models\Portfolio::query()->where('is_active', true);

        $category = $request->query('category');
        if ($category && $category !== 'all') {
            $query->where('category', $category);
        }

        $items = $query->orderBy('order')->latest('id')->get();

        return response()->json([
            'data' => $items
        ]);
    }


    // GET /api/public/portfolios/{slug}
    public function show(string $slug)
    {
        $portfolio = Portfolio::where('is_active', true)
            ->where('slug', $slug)
            ->firstOrFail();

        return response()->json([
            'data' => $portfolio,
        ]);
    }
}
