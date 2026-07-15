<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Services\ReservationService;
use Illuminate\Http\Request;

class BookingSubmissionController extends Controller
{
    protected $reservationService;

    public function __construct(ReservationService $reservationService)
    {
        $this->reservationService = $reservationService;
    }

    public function store(Request $request)
    {
        $request->validate([
            'fullName' => 'required|string|max:255',
            'whatsapp' => 'required|string|max:30',
            'branch_id' => 'required',
            'date' => 'required|date',
            'complaint' => 'nullable|string',
            'branch_name' => 'nullable|string',
        ]);

        $branchId = is_numeric($request->branch_id) ? (int)$request->branch_id : null;
        if (!$branchId) {
            $branch = Branch::active()->first();
            $branchId = $branch ? $branch->id : 1;
        }

        $complaintText = $request->complaint ?: 'Pemeriksaan Mata';
        $branchNote = !is_numeric($request->branch_id) ? " [Layanan Pilihan: " . ($request->branch_name ?: $request->branch_id) . "]" : "";
        $referralNote = $request->referral_code ? "\nKode Referal: " . strtoupper($request->referral_code) : "";

        $reservation = $this->reservationService->createReservation([
            'reservation_type' => 'Online',
            'branch_id' => $branchId,
            'customer_name' => $request->fullName,
            'customer_phone' => $request->whatsapp,
            'reservation_date' => $request->date,
            'reservation_time' => $request->time ?? '10:00',
            'status' => 'Waiting',
            'notes' => "Tipe Keluhan / Kebutuhan: " . $complaintText . $branchNote . $referralNote,
            'items' => [],
        ]);

        return redirect()->back()->with([
            'success' => 'Reservasi berhasil disimpan (No. Reservasi: ' . $reservation->reservation_number . '). Tim admin kami akan segera menghubungi nomor WhatsApp Anda.',
            'reservation_number' => $reservation->reservation_number,
        ]);
    }
}
