<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\Faq;
use App\Models\HomeSection;
use App\Models\Portfolio;
use App\Models\WhyChoose;

class PublicHomeController extends Controller
{
    public function index()
    {
        return response()->json([
            'heroes' => HomeSection::where('is_active', true)->orderBy('order')->get(),
            'why_chooses' => WhyChoose::where('is_active', true)->orderBy('order')->get(),
            'featured_portfolios' => Portfolio::where('is_active', true)
                ->where('is_featured', true)
                ->orderBy('order')
                ->get(),
            'clients' => Client::where('is_active', true)->orderBy('order')->get(),
            'faqs' => Faq::where('is_active', true)->orderBy('order')->get(),
        ]);
    }
}
