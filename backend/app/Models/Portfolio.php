<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Portfolio extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'description',
        'category',
        'media',
        'is_featured',
        'order',
        'is_active'
    ];

    protected $casts = [
        'media' => 'array',
        'is_featured' => 'boolean',
        'is_active' => 'boolean',
    ];
}
