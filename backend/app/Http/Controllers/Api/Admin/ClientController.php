<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Client;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    /**
     * GET /api/clients
     */
    public function index(Request $request)
    {
        $query = Client::query();

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

        $clients = $query->orderBy('order')->orderBy('id', 'desc')->get();

        return response()->json([
            'data' => $clients,
        ]);
    }

    /**
     * POST /api/clients
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:150'],
            'logo' => ['required', 'string', 'max:255'], // path from /upload
            'order' => ['sometimes', 'integer', 'min:0'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $data['order'] = $data['order'] ?? 0;
        $data['is_active'] = $data['is_active'] ?? true;

        $client = Client::create($data);

        return response()->json([
            'message' => 'Client created',
            'data' => $client,
        ], 201);
    }

    /**
     * GET /api/clients/{id}
     */
    public function show(string $id)
    {
        $client = Client::findOrFail($id);

        return response()->json([
            'data' => $client,
        ]);
    }

    /**
     * PATCH/PUT /api/clients/{id}
     */
    public function update(Request $request, string $id)
    {
        $client = Client::findOrFail($id);

        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:150'],
            'logo' => ['sometimes', 'string', 'max:255'],
            'order' => ['sometimes', 'integer', 'min:0'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $client->update($data);

        return response()->json([
            'message' => 'Client updated',
            'data' => $client->fresh(),
        ]);
    }

    /**
     * DELETE /api/clients/{id}
     */
    public function destroy(string $id)
    {
        $client = Client::findOrFail($id);
        $client->delete();

        return response()->json([
            'message' => 'Client deleted',
        ]);
    }
}
