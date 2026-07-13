<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'Harmoni by Phoenix Sehat') }}</title>
        <link rel="icon" type="image/png" href="{{ asset('logo.png') }}">

        <!-- Open Graph / WhatsApp / Social Share Meta Tags -->
        <meta property="og:title" content="Harmoni by Phoenix Sehat — Layanan Kesehatan Mata Premium">
        <meta property="og:description" content="Layanan kesehatan mata premium yang menghadirkan solusi penglihatan komprehensif, memadukan pemeriksaan refraksi akurat, konsultasi ahli, dan penyediaan bingkai berkualitas.">
        <meta property="og:image" content="{{ asset('logo.png') }}">
        <meta property="og:type" content="website">
        <meta property="og:url" content="{{ url('/') }}">

        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="Harmoni by Phoenix Sehat — Layanan Kesehatan Mata Premium">
        <meta name="twitter:description" content="Harmoni by Phoenix Sehat adalah pusat perawatan mata holistik dan penyedia kacamata profesional yang berdedikasi untuk meningkatkan kualitas penglihatan pelanggan.">
        <meta name="twitter:image" content="{{ asset('logo.png') }}">

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
