<?php

use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

//Route::get('/', function () {
//    return Inertia::render('welcome');
//})->name('home');

Route::get('/', [ProductController::class, 'index'])->name('welcome');
Route::get('/product/{product:slug}', [ProductController::class, 'show'])->name('product.show');
Route::post('/cart/store/{product}', function () {

})->name('cart.store');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
