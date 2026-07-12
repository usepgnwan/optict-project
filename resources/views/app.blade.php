<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'Optik Calm') }}</title>

        <!-- Open Graph / WhatsApp / Social Share Meta Tags -->
        <meta property="og:title" content="Optik Calm — Modern Optical Store Management & Eye Care">
        <meta property="og:description" content="Layanan optik modern terpercaya. Pilihan frame dan lensa berkualitas tinggi dengan pelayanan profesional di seluruh cabang Optik Calm.">
        <meta property="og:image" content="{{ asset('share-preview.png') }}">
        <meta property="og:type" content="website">
        <meta property="og:url" content="{{ url('/') }}">

        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="Optik Calm — Modern Optical Store">
        <meta name="twitter:description" content="Pilihan frame dan lensa berkualitas tinggi dengan pelayanan profesional di seluruh cabang Optik Calm.">
        <meta name="twitter:image" content="{{ asset('share-preview.png') }}">

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">

        <!-- Material Symbols -->
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet">

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/Pages/{$page['component']}.tsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased bg-background text-on-background">
        @inertia
    </body>
</html>
