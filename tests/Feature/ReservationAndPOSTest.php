<?php

namespace Tests\Feature;

use App\Models\Branch;
use App\Models\Customer;
use App\Models\Service;
use App\Models\ServiceCategory;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReservationAndPOSTest extends TestCase
{
    use RefreshDatabase;

    public function test_service_master_crud_flow(): void
    {
        $user = User::factory()->create();

        $category = ServiceCategory::create([
            'code' => 'CAT-TEST',
            'name' => 'Eye Exam Category',
        ]);

        $response = $this->actingAs($user)->post(route('services.store'), [
            'service_code' => 'SRV-100',
            'name' => 'Complete Eye Examination',
            'service_category_id' => $category->id,
            'duration_minutes' => 30,
            'price' => 100000,
            'is_active' => true,
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('services', [
            'service_code' => 'SRV-100',
            'name' => 'Complete Eye Examination',
            'price' => 100000,
        ]);
    }

    public function test_customer_creation_with_unique_phone(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post(route('customers.store'), [
            'customer_code' => 'CUST-0001',
            'full_name' => 'Budi Santoso',
            'phone_number' => '081234567890',
            'email' => 'budi@example.com',
            'gender' => 'Male',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('customers', [
            'customer_code' => 'CUST-0001',
            'full_name' => 'Budi Santoso',
            'phone_number' => '081234567890',
        ]);
    }

    public function test_branch_scoped_reservation_creation_and_status_update(): void
    {
        $user = User::factory()->create();
        $branch = Branch::create([
            'name' => 'Harmoni by Phoeinx Sehat Pusat',
            'address' => 'Jl. Sudirman 1',
            'city' => 'Jakarta',
            'phone' => '021-111111',
            'is_active' => true,
        ]);

        $customer = Customer::create([
            'customer_code' => 'CUST-0002',
            'full_name' => 'Siti Aminah',
            'phone_number' => '08199998888',
        ]);

        $service = Service::create([
            'service_code' => 'SRV-200',
            'name' => 'Fitting Lensa Kontak',
            'duration_minutes' => 45,
            'price' => 150000,
            'is_active' => true,
        ]);

        $response = $this->actingAs($user)->post(route('reservations.store'), [
            'reservation_type' => 'Online',
            'branch_id' => $branch->id,
            'customer_id' => $customer->id,
            'reservation_date' => '2026-07-20',
            'reservation_time' => '10:00',
            'notes' => 'Pasien pemakai lensa kontak baru',
            'items' => [
                [
                    'service_id' => $service->id,
                    'qty' => 1,
                    'price' => 150000,
                ],
            ],
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('reservations', [
            'branch_id' => $branch->id,
            'customer_id' => $customer->id,
            'status' => 'Waiting',
        ]);
    }
}
