<?php

namespace App\Services;

use App\Models\AuditLog;
use App\Models\Customer;
use App\Models\Reservation;
use App\Models\ReservationItem;
use Illuminate\Support\Facades\DB;

class ReservationService
{
    /**
     * Create a new branch-scoped reservation with items.
     */
    public function createReservation(array $data): Reservation
    {
        return DB::transaction(function () use ($data) {
            $customerId = $data['customer_id'] ?? null;

            // If non-member / walk in guest entered name & phone
            if (empty($customerId) && !empty($data['customer_name'])) {
                $phone = $data['customer_phone'] ?? ('GUEST-' . time());
                $existingCust = Customer::where('phone_number', $phone)->first();
                if ($existingCust) {
                    $customerId = $existingCust->id;
                } else {
                    $newCust = Customer::create([
                        'customer_code' => 'CUST-W' . strtoupper(substr(uniqid(), -5)),
                        'full_name' => $data['customer_name'],
                        'phone_number' => $phone,
                    ]);
                    $customerId = $newCust->id;
                }
            }

            $reservation = Reservation::create([
                'reservation_number' => $data['reservation_number'] ?? $this->generateReservationNumber(),
                'reservation_type' => $data['reservation_type'] ?? 'Online',
                'branch_id' => $data['branch_id'],
                'customer_id' => $customerId,
                'customer_name' => $data['customer_name'] ?? null,
                'customer_phone' => $data['customer_phone'] ?? null,
                'reservation_date' => $data['reservation_date'],
                'reservation_time' => $data['reservation_time'],
                'assigned_staff_id' => $data['assigned_staff_id'] ?? null,
                'status' => $data['status'] ?? 'Waiting',
                'notes' => $data['notes'] ?? null,
            ]);

            if (!empty($data['items'])) {
                foreach ($data['items'] as $item) {
                    ReservationItem::create([
                        'reservation_id' => $reservation->id,
                        'service_id' => $item['service_id'],
                        'qty' => $item['qty'] ?? 1,
                        'price' => $item['price'] ?? 0,
                        'discount' => $item['discount'] ?? 0,
                        'subtotal' => ($item['qty'] ?? 1) * (($item['price'] ?? 0) - ($item['discount'] ?? 0)),
                    ]);
                }
            }

            AuditLog::log(
                'reservation.created',
                Reservation::class,
                $reservation->id,
                null,
                $reservation->toArray()
            );

            return $reservation->load(['branch', 'customer', 'assignedStaff', 'items.service']);
        });
    }

    /**
     * Update reservation status safely and log audit trail.
     */
    public function updateStatus(Reservation $reservation, string $newStatus): Reservation
    {
        $oldValues = ['status' => $reservation->status];
        $reservation->update(['status' => $newStatus]);

        AuditLog::log(
            'reservation.status_updated',
            Reservation::class,
            $reservation->id,
            $oldValues,
            ['status' => $newStatus]
        );

        return $reservation;
    }

    /**
     * Generate unique reservation number.
     */
    public function generateReservationNumber(): string
    {
        $prefix = 'RES-' . date('Ymd') . '-';
        $latest = Reservation::where('reservation_number', 'like', $prefix . '%')
            ->orderBy('id', 'desc')
            ->first();

        $seq = 1;
        if ($latest) {
            $parts = explode('-', $latest->reservation_number);
            $seq = intval(end($parts)) + 1;
        }

        return $prefix . str_pad($seq, 4, '0', STR_PAD_LEFT);
    }
}
