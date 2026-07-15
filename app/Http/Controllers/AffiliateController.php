<?php

namespace App\Http\Controllers;

use App\Models\Affiliate;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AffiliateController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => 'required|string|max:20|unique:affiliates,phone',
            'city' => 'required|string|max:100',
            'age' => 'required|integer|min:17',
            'promotional_media' => 'nullable|array',
            'promotional_link' => 'required|string|max:255',
            'photo' => 'required|image|max:5120', // 5MB max
            'bank_name' => 'required|string|max:100',
            'bank_account_number' => 'required|string|max:50',
            'agreement' => 'accepted',
        ], [
            'email.unique' => 'Email sudah terdaftar.',
            'phone.unique' => 'Nomor WhatsApp sudah terdaftar.',
        ]);

        $avatarPath = null;
        if ($request->hasFile('photo')) {
            $avatarPath = $request->file('photo')->store('avatars', 'public');
        }

        $affiliatorRole = Role::where('name', Role::AFFILIATOR)->first();

        // Create User
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make(Str::random(12)), // Dummy password, will be reset or we can ask them for password later
            'role_id' => $affiliatorRole?->id,
            'is_active' => false,
            'avatar' => $avatarPath,
        ]);

        // Generate Referral Code: PHNX-[NAMA DEPAN]
        $firstName = strtoupper(explode(' ', $validated['name'])[0]);
        $baseCode = 'PHNX-' . preg_replace('/[^A-Z]/', '', $firstName);
        if (empty(preg_replace('/[^A-Z]/', '', $firstName))) {
            $baseCode = 'PHNX-' . strtoupper(\Illuminate\Support\Str::random(4));
        }
        
        $referralCode = $baseCode;
        $counter = 1;
        while (\App\Models\Affiliate::where('referral_code', $referralCode)->exists()) {
            $referralCode = $baseCode . $counter;
            $counter++;
        }

        // Create Affiliate Record
        Affiliate::create([
            'user_id' => $user->id,
            'referral_code' => $referralCode,
            'phone' => $validated['phone'],
            'city' => $validated['city'],
            'age' => $validated['age'],
            'promotional_media' => $validated['promotional_media'] ?? [],
            'promotional_link' => $validated['promotional_link'],
            'bank_name' => $validated['bank_name'],
            'bank_account_number' => $validated['bank_account_number'],
            'status' => 'pending',
        ]);

        return redirect()->back()->with('success', 'Pendaftaran berhasil dikirim. Menunggu persetujuan admin.');
    }
}
