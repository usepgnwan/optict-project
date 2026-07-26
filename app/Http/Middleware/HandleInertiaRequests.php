<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'ziggy' => fn () => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            'sharedComplaintTypes' => fn () => \App\Models\ComplaintType::active()->ordered()->get(),
            'settingWaNumber' => fn () => \App\Models\Setting::where('key', 'whatsapp_number')->value('value') ?? '081199988877',
            'settingWaMessage' => fn () => \App\Models\Setting::where('key', 'whatsapp_message')->value('value') ?? 'Halo Harmoni Kacamata, saya tertarik ingin reservasi. Bisa jelaskan secara detail bagaimana prosesnya?',
            'settingWaCatalogMessage' => fn () => \App\Models\Setting::where('key', 'whatsapp_catalog_message')->value('value') ?? 'Halo Harmoni Kacamata, saya tertarik memesan kacamata [produk] di cabang [cabang].',
            'settingWaBookingMessage' => fn () => \App\Models\Setting::where('key', 'whatsapp_booking_message')->value('value') ?? "Halo Harmoni by Phoeinx Sehat ([cabang]), saya sudah membuat reservasi online dengan detail berikut:\n\n• No. Reservasi: [no_reservasi]\n• Nama: [nama]\n• WhatsApp: [whatsapp]\n• Cabang / Layanan: [cabang]\n• Tipe Keluhan: [keluhan]\n• Rencana Tanggal: [tanggal]\n\nMohon konfirmasinya, terima kasih!",
            'newBookings' => fn () => $request->user() ? \App\Models\Reservation::with('branch')->where('status', 'pending')->latest()->take(5)->get() : [],
            'newBookingsCount' => fn () => $request->user() ? \App\Models\Reservation::where('status', 'pending')->count() : 0,
        ];
    }
}
