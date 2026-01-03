<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (!Auth::attempt($data)) {
            return response()->json(['message' => 'Invalid credentials'], 422);
        }

        $user = $request->user();

        // token for API
        $token = $user->createToken('admin-token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $user,
        ]);
    }

    public function me(Request $request)
    {
        return response()->json(['user' => $request->user()]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out']);
    }
    public function changePassword(Request $request)
    {
        $data = $request->validate([
            'current_password' => ['required'],
            'password' => ['required', 'min:6', 'confirmed'],
        ]);

        $user = $request->user();

        // cek password lama
        if (!Hash::check($data['current_password'], $user->password)) {
            return response()->json([
                'message' => 'Current password salah',
            ], 422);
        }

        // update password
        $user->password = Hash::make($data['password']);
        $user->save();

        // ✅ rekomendasi: revoke semua token biar aman (auto logout semua device)
        $user->tokens()->delete();

        return response()->json([
            'message' => 'Password berhasil diubah. Silakan login ulang.',
        ]);
    }
}
