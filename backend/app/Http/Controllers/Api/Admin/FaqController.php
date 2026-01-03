<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Faq;
use Illuminate\Http\Request;

class FaqController extends Controller
{
    /**
     * GET /api/faqs
     */
    public function index(Request $request)
    {
        $query = Faq::query();

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

        $faqs = $query->orderBy('order')->orderBy('id', 'desc')->get();

        return response()->json([
            'data' => $faqs,
        ]);
    }

    /**
     * POST /api/faqs
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'question' => ['required', 'string', 'max:255'],
            'answer' => ['required', 'string'],
            'order' => ['sometimes', 'integer', 'min:0'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $data['order'] = $data['order'] ?? 0;
        $data['is_active'] = $data['is_active'] ?? true;

        $faq = Faq::create($data);

        return response()->json([
            'message' => 'FAQ created',
            'data' => $faq,
        ], 201);
    }

    /**
     * GET /api/faqs/{id}
     */
    public function show(string $id)
    {
        $faq = Faq::findOrFail($id);

        return response()->json([
            'data' => $faq,
        ]);
    }

    /**
     * PATCH/PUT /api/faqs/{id}
     */
    public function update(Request $request, string $id)
    {
        $faq = Faq::findOrFail($id);

        $data = $request->validate([
            'question' => ['sometimes', 'string', 'max:255'],
            'answer' => ['sometimes', 'string'],
            'order' => ['sometimes', 'integer', 'min:0'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $faq->update($data);

        return response()->json([
            'message' => 'FAQ updated',
            'data' => $faq->fresh(),
        ]);
    }

    /**
     * DELETE /api/faqs/{id}
     */
    public function destroy(string $id)
    {
        $faq = Faq::findOrFail($id);
        $faq->delete();

        return response()->json([
            'message' => 'FAQ deleted',
        ]);
    }
}
