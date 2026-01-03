<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\WhyChoose;
use Illuminate\Http\Request;

class WhyChooseController extends Controller
{
    /**
     * GET /api/why-chooses
     */
    public function index(Request $request)
    {
        $query = WhyChoose::query();

        // Optional filter: is_active=true/false/1/0
        if ($request->filled('is_active')) {
            $isActive = filter_var(
                $request->input('is_active'),
                FILTER_VALIDATE_BOOLEAN,
                FILTER_NULL_ON_FAILURE
            );

            if (!is_null($isActive)) {
                $query->where('is_active', $isActive);
            }
        }

        $items = $query->orderBy('order')->orderBy('id', 'desc')->get();

        return response()->json([
            'data' => $items,
        ]);
    }

    /**
     * POST /api/why-chooses
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:150'],
            'description' => ['required', 'string'],
            'order' => ['sometimes', 'integer', 'min:0'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $data['order'] = $data['order'] ?? 0;
        $data['is_active'] = $data['is_active'] ?? true;

        $item = WhyChoose::create($data);

        return response()->json([
            'message' => 'Why choose created',
            'data' => $item,
        ], 201);
    }

    /**
     * GET /api/why-chooses/{id}
     */
    public function show(string $id)
    {
        $item = WhyChoose::findOrFail($id);

        return response()->json([
            'data' => $item,
        ]);
    }

    /**
     * PATCH/PUT /api/why-chooses/{id}
     */
    public function update(Request $request, string $id)
    {
        $item = WhyChoose::findOrFail($id);

        $data = $request->validate([
            'title' => ['sometimes', 'string', 'max:150'],
            'description' => ['sometimes', 'string'],
            'order' => ['sometimes', 'integer', 'min:0'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $item->update($data);

        return response()->json([
            'message' => 'Why choose updated',
            'data' => $item->fresh(),
        ]);
    }

    /**
     * DELETE /api/why-chooses/{id}
     */
    public function destroy(string $id)
    {
        $item = WhyChoose::findOrFail($id);
        $item->delete();

        return response()->json([
            'message' => 'Why choose deleted',
        ]);
    }
}
