<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerController extends Controller
{
    public function index(Request $request)
    {
        $query = Customer::withCount(['reservations', 'sales']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('full_name', 'like', "%{$search}%")
                    ->orWhere('customer_code', 'like', "%{$search}%")
                    ->orWhere('phone_number', 'like', "%{$search}%");
            });
        }

        $customers = $query->orderBy('full_name')->paginate(15)->withQueryString();

        return Inertia::render('Admin/Customers/Index', [
            'customers' => $customers,
            'filters' => $request->only(['search']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_code' => 'required|string|unique:customers,customer_code',
            'full_name' => 'required|string|max:255',
            'phone_number' => 'required|string|unique:customers,phone_number',
            'email' => 'nullable|email',
            'address' => 'nullable|string',
            'date_of_birth' => 'nullable|date',
            'gender' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $customer = Customer::create($validated);

        if ($request->wantsJson()) {
            return response()->json(['success' => true, 'customer' => $customer]);
        }

        return redirect()->back()->with('success', 'Customer created successfully.');
    }

    public function update(Request $request, Customer $customer)
    {
        $validated = $request->validate([
            'customer_code' => 'required|string|unique:customers,customer_code,' . $customer->id,
            'full_name' => 'required|string|max:255',
            'phone_number' => 'required|string|unique:customers,phone_number,' . $customer->id,
            'email' => 'nullable|email',
            'address' => 'nullable|string',
            'date_of_birth' => 'nullable|date',
            'gender' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $customer->update($validated);

        return redirect()->back()->with('success', 'Customer updated successfully.');
    }

    public function destroy(Customer $customer)
    {
        $customer->delete();

        return redirect()->back()->with('success', 'Customer deleted successfully.');
    }

    /**
     * JSON search endpoint for POS cashier autocomplete.
     */
    public function search(Request $request)
    {
        $search = $request->get('q', '');
        $customers = Customer::where('full_name', 'like', "%{$search}%")
            ->orWhere('phone_number', 'like', "%{$search}%")
            ->orWhere('customer_code', 'like', "%{$search}%")
            ->take(10)
            ->get();

        return response()->json($customers);
    }
}
