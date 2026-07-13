<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\Customer;
use App\Models\Discount;
use App\Models\PaymentMethod;
use App\Models\Reservation;
use App\Models\ReservationItem;
use App\Models\Service;
use App\Models\ServiceCategory;
use App\Models\User;
use Illuminate\Database\Seeder;

class POSSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Service Categories
        $examCat = ServiceCategory::firstOrCreate(
            ['code' => 'CAT01'],
            ['name' => 'Examination', 'description' => 'Clinical eye examination services']
        );
        $frameCat = ServiceCategory::firstOrCreate(
            ['code' => 'CAT02'],
            ['name' => 'Fitting & Adjustment', 'description' => 'Frame and contact lens fittings']
        );

        // 2. Services (matching prompt example)
        $services = [
            [
                'service_code' => 'SRV001',
                'name' => 'Eye Examination',
                'service_category_id' => $examCat->id,
                'description' => 'Comprehensive refractive and retinal examination',
                'duration_minutes' => 30,
                'price' => 100000,
                'is_active' => true,
            ],
            [
                'service_code' => 'SRV002',
                'name' => 'Frame Adjustment',
                'service_category_id' => $frameCat->id,
                'description' => 'Optical frame realignment and nose pad adjustment',
                'duration_minutes' => 15,
                'price' => 25000,
                'is_active' => true,
            ],
            [
                'service_code' => 'SRV003',
                'name' => 'Lens Installation',
                'service_category_id' => $frameCat->id,
                'description' => 'Precision cutting and installation of prescription lenses',
                'duration_minutes' => 45,
                'price' => 50000,
                'is_active' => true,
            ],
            [
                'service_code' => 'SRV004',
                'name' => 'Contact Lens Fitting',
                'service_category_id' => $examCat->id,
                'description' => 'Corneal curvature assessment and contact lens trial',
                'duration_minutes' => 30,
                'price' => 150000,
                'is_active' => true,
            ],
        ];

        foreach ($services as $srvData) {
            Service::updateOrCreate(['service_code' => $srvData['service_code']], $srvData);
        }

        // 3. Customers
        $customers = [
            [
                'customer_code' => 'CUST001',
                'full_name' => 'John Doe',
                'phone_number' => '081234567890',
                'email' => 'john.doe@example.com',
                'address' => 'Jl. Sudirman No. 45, Jakarta',
                'date_of_birth' => '1990-05-14',
                'gender' => 'Male',
                'notes' => 'Prefers titanium frames',
            ],
            [
                'customer_code' => 'CUST002',
                'full_name' => 'Jane Smith',
                'phone_number' => '081298765432',
                'email' => 'jane.smith@example.com',
                'address' => 'Jl. Thamrin No. 12, Jakarta',
                'date_of_birth' => '1985-11-20',
                'gender' => 'Female',
                'notes' => 'High myopia customer',
            ],
            [
                'customer_code' => 'CUST003',
                'full_name' => 'Budi Santoso',
                'phone_number' => '082111223344',
                'email' => 'budi.santoso@example.com',
                'address' => 'Jl. Merdeka No. 88, Bandung',
                'date_of_birth' => '1995-03-10',
                'gender' => 'Male',
                'notes' => 'Regular eye checkup every 6 months',
            ],
        ];

        foreach ($customers as $cData) {
            Customer::updateOrCreate(['phone_number' => $cData['phone_number']], $cData);
        }

        // 4. Payment Methods
        $paymentMethods = [
            ['code' => 'PM-CASH', 'name' => 'Cash', 'type' => 'Cash'],
            ['code' => 'PM-QRIS', 'name' => 'QRIS', 'type' => 'QRIS'],
            ['code' => 'PM-DEBIT', 'name' => 'Debit Card', 'type' => 'Debit Card'],
            ['code' => 'PM-CREDIT', 'name' => 'Credit Card', 'type' => 'Credit Card'],
            ['code' => 'PM-TF', 'name' => 'Bank Transfer', 'type' => 'Bank Transfer'],
            ['code' => 'PM-EWALLET', 'name' => 'E-Wallet', 'type' => 'E-Wallet'],
        ];

        foreach ($paymentMethods as $pm) {
            PaymentMethod::updateOrCreate(['code' => $pm['code']], $pm);
        }

        // 5. Discounts
        Discount::updateOrCreate(
            ['code' => 'MEMBER10'],
            [
                'name' => 'Member Discount 10%',
                'type' => 'percentage',
                'value' => 10,
                'apply_to' => 'entire_invoice',
                'is_active' => true,
            ]
        );
        Discount::updateOrCreate(
            ['code' => 'PROMO50'],
            [
                'name' => 'Promo Fixed Rp 50,000',
                'type' => 'fixed_amount',
                'value' => 50000,
                'apply_to' => 'entire_invoice',
                'is_active' => true,
            ]
        );

        // 6. Create sample branch-scoped reservations
        $branches = Branch::all();
        $john = Customer::where('customer_code', 'CUST001')->first();
        $jane = Customer::where('customer_code', 'CUST002')->first();
        $staff = User::first();
        $srvExam = Service::where('service_code', 'SRV001')->first();
        $srvLens = Service::where('service_code', 'SRV003')->first();
        $srvFrame = Service::where('service_code', 'SRV002')->first();

        if ($branches->isNotEmpty() && $john && $srvExam) {
            $branch = $branches->first();
            $res1 = Reservation::updateOrCreate(
                ['reservation_number' => 'RES-20260713-0001'],
                [
                    'reservation_type' => 'Online',
                    'branch_id' => $branch->id,
                    'customer_id' => $john->id,
                    'reservation_date' => now()->toDateString(),
                    'reservation_time' => '10:00',
                    'assigned_staff_id' => $staff?->id,
                    'status' => 'Confirmed',
                    'notes' => 'Customer requested John Doe exam & lens installation',
                ]
            );

            // Clear items and re-seed
            $res1->items()->delete();
            ReservationItem::create([
                'reservation_id' => $res1->id,
                'service_id' => $srvExam->id,
                'qty' => 1,
                'price' => $srvExam->price,
                'discount' => 0,
                'subtotal' => $srvExam->price,
            ]);
            if ($srvLens) {
                ReservationItem::create([
                    'reservation_id' => $res1->id,
                    'service_id' => $srvLens->id,
                    'qty' => 1,
                    'price' => $srvLens->price,
                    'discount' => 0,
                    'subtotal' => $srvLens->price,
                ]);
            }
            if ($srvFrame) {
                ReservationItem::create([
                    'reservation_id' => $res1->id,
                    'service_id' => $srvFrame->id,
                    'qty' => 1,
                    'price' => $srvFrame->price,
                    'discount' => 0,
                    'subtotal' => $srvFrame->price,
                ]);
            }
        }

        if ($branches->count() > 1 && $jane && $srvExam) {
            $branch2 = $branches->get(1) ?? $branches->first();
            $res2 = Reservation::updateOrCreate(
                ['reservation_number' => 'RES-20260713-0002'],
                [
                    'reservation_type' => 'Walk In',
                    'branch_id' => $branch2->id,
                    'customer_id' => $jane->id,
                    'reservation_date' => now()->toDateString(),
                    'reservation_time' => '14:00',
                    'assigned_staff_id' => $staff?->id,
                    'status' => 'Waiting',
                    'notes' => 'Walk in contact lens fitting',
                ]
            );
            $res2->items()->delete();
            ReservationItem::create([
                'reservation_id' => $res2->id,
                'service_id' => $srvExam->id,
                'qty' => 1,
                'price' => $srvExam->price,
                'discount' => 0,
                'subtotal' => $srvExam->price,
            ]);
        }
    }
}
