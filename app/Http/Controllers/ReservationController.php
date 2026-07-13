<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Models\Customer;
use App\Models\Reservation;
use App\Models\Service;
use App\Models\User;
use App\Services\ReservationService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReservationController extends Controller
{
    public function __construct(protected ReservationService $reservationService)
    {
    }

    public function index(Request $request)
    {
        $branchId = $request->get('branch_id', auth()->user()?->branch_id ?? Branch::first()?->id ?? 1);

        $query = Reservation::with(['branch', 'customer', 'assignedStaff', 'items.service'])
            ->where('branch_id', $branchId);

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->filled('date')) {
            $query->whereDate('reservation_date', $request->date);
        }

        $reservations = $query->orderBy('reservation_date', 'desc')
            ->orderBy('reservation_time', 'desc')
            ->get();

        return Inertia::render('Admin/Reservations/Index', [
            'reservations' => $reservations,
            'branches' => Branch::active()->get(),
            'customers' => Customer::orderBy('full_name')->get(),
            'services' => Service::active()->orderBy('name')->get(),
            'staffMembers' => User::all(),
            'currentBranchId' => (int) $branchId,
            'filters' => $request->only(['status', 'date', 'branch_id']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'reservation_type' => 'required|in:Online,Walk In',
            'branch_id' => 'required|exists:branches,id',
            'customer_id' => 'nullable|exists:customers,id',
            'customer_name' => 'nullable|string|max:255',
            'customer_phone' => 'nullable|string|max:50',
            'reservation_date' => 'required|date',
            'reservation_time' => 'required|string',
            'assigned_staff_id' => 'nullable|exists:users,id',
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.service_id' => 'required|exists:services,id',
            'items.*.qty' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric|min:0',
        ]);

        $reservation = $this->reservationService->createReservation($validated);

        return redirect()->back()->with('success', 'Reservation created successfully: ' . $reservation->reservation_number);
    }

    public function updateStatus(Request $request, Reservation $reservation)
    {
        $request->validate([
            'status' => 'required|string|in:Waiting,Confirmed,Checked In,In Progress,Completed,Cancelled,No Show',
        ]);

        $this->reservationService->updateStatus($reservation, $request->status);

        return redirect()->back()->with('success', 'Reservation status updated to ' . $request->status);
    }
}
