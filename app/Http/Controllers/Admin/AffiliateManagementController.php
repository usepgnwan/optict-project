<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Affiliate;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AffiliateManagementController extends Controller
{
    public function index(Request $request)
    {
        $query = Affiliate::with('user');

        if ($search = $request->input('search')) {
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'ilike', "%{$search}%")
                  ->orWhere('email', 'ilike', "%{$search}%");
            })->orWhere('referral_code', 'ilike', "%{$search}%");
        }

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        $affiliates = $query->orderByDesc('created_at')->paginate(15)->withQueryString();

        return Inertia::render('Admin/Affiliates/Index', [
            'affiliates' => $affiliates,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function approve(Request $request, Affiliate $affiliate)
    {
        $request->validate([
            'password' => 'required|string|min:6',
        ]);

        $affiliate->update(['status' => 'active']);
        if ($affiliate->user) {
            $affiliate->user->update([
                'is_active' => true,
                'password' => \Illuminate\Support\Facades\Hash::make($request->password)
            ]);
        }

        return back()->with('success', 'Affiliator berhasil disetujui dan password telah diatur.');
    }

    public function reject(Affiliate $affiliate)
    {
        $affiliate->update(['status' => 'rejected']);
        
        return back()->with('success', 'Pendaftaran affiliator ditolak.');
    }
}
