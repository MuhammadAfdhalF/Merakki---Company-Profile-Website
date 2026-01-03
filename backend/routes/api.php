<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\Admin\AuthController;
use App\Http\Controllers\Api\Admin\HomeSectionController;
use App\Http\Controllers\Api\Admin\WhyChooseController;
use App\Http\Controllers\Api\Admin\PortfolioController;
use App\Http\Controllers\Api\Admin\ClientController;
use App\Http\Controllers\Api\Admin\FaqController;
use App\Http\Controllers\Api\Admin\UploadController;

use App\Http\Controllers\Api\Public\PublicHomeController;
use App\Http\Controllers\Api\Public\PublicPortfolioController;

// AUTH (public)
Route::post('/auth/login', [AuthController::class, 'login']);

// AUTH + ADMIN (protected)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    Route::middleware('is_admin')->group(function () {
        // upload
        Route::post('/upload', [UploadController::class, 'store']);

        // CRUD
        Route::apiResource('home-sections', HomeSectionController::class);
        Route::apiResource('why-chooses', WhyChooseController::class);
        Route::apiResource('portfolios', PortfolioController::class);
        Route::apiResource('clients', ClientController::class);
        Route::apiResource('faqs', FaqController::class);
    });
});

// PUBLIC (Next.js)
Route::get('/home', [PublicHomeController::class, 'index']);

Route::prefix('public')->group(function () {
    Route::get('/portfolios', [PublicPortfolioController::class, 'index']);
    Route::get('/portfolios/{slug}', [PublicPortfolioController::class, 'show']);
});
