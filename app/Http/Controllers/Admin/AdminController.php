<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Property;
use App\Models\AuditLog;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class AdminController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAdminPanel', User::class);

        $users = User::query()
            ->with(['property', 'roles'])
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
            })
            ->when($request->role, function ($query, $role) {
                $query->whereHas('roles', function ($q) use ($role) {
                    $q->where('name', $role);
                });
            })
            ->when($request->property_id, function ($query, $propertyId) {
                $query->where('property_id', $propertyId);
            })
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        $properties = Property::all();
        $availableRoles = Role::all();

        $stats = [
            'total_users' => User::count(),
            'active_users' => User::where('email_verified_at', '!=', null)->count(),
            'total_properties' => Property::count(),
            'recent_audit_logs' => AuditLog::with(['user'])
                ->latest()
                ->take(5)
                ->get()
                ->map(function ($log) {
                    return [
                        'id' => $log->id,
                        'action' => $log->action,
                        'user_name' => $log->user?->name ?? 'System',
                        'created_at' => $log->created_at?->diffForHumans(),
                    ];
                }),
        ];

        return Inertia::render('admin/index', [
            'users' => $users,
            'properties' => $properties,
            'availableRoles' => $availableRoles,
            'stats' => $stats,
            'filters' => $request->only(['search', 'role', 'property_id']),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', User::class);

        $properties = Property::all();

        return Inertia::render('admin/users/create', [
            'properties' => $properties,
        ]);
    }

    public function store(Request $request)
    {
        $this->authorize('create', User::class);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'roles' => ['array'],
            'roles.*' => ['exists:roles,id'],
            'property_id' => ['nullable', 'exists:properties,id'],
            'department' => ['nullable', 'string', 'max:64'],
            'is_active' => ['boolean'],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'property_id' => $validated['property_id'],
            'department' => $validated['department'] ?? null,
            'is_active' => $validated['is_active'] ?? true,
            'email_verified_at' => now(),
        ]);

        if (!empty($validated['roles'])) {
            $user->syncRoles($validated['roles'], auth()->user());
        }

        return redirect()->route('admin.users.show', $user)
                        ->with('success', 'User created successfully.');
    }

    public function show(User $user): Response
    {
        $this->authorize('view', $user);

        $user->load(['property', 'auditLogs' => function ($query) {
            $query->latest()->take(20);
        }]);

        return Inertia::render('admin/users/show', [
            'user' => $user,
            'auditLogs' => $user->auditLogs,
        ]);
    }

    public function edit(User $user): Response
    {
        $this->authorize('update', $user);

        $properties = Property::all();

        return Inertia::render('admin/users/edit', [
            'user' => $user,
            'properties' => $properties,
        ]);
    }

    public function update(Request $request, User $user)
    {
        $this->authorize('update', $user);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'roles' => ['array'],
            'roles.*' => ['exists:roles,id'],
            'property_id' => ['nullable', 'exists:properties,id'],
            'department' => ['nullable', 'string', 'max:64'],
            'is_active' => ['boolean'],
            'password' => ['nullable', 'string', 'min:8', 'confirmed'],
        ]);

        $updateData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'property_id' => $validated['property_id'],
            'department' => $validated['department'] ?? null,
            'is_active' => $validated['is_active'] ?? $user->is_active,
        ];

        if (!empty($validated['password'])) {
            $updateData['password'] = Hash::make($validated['password']);
        }

        $user->update($updateData);

        $user->syncRoles($validated['roles'] ?? [], auth()->user());

        return redirect()->route('admin.users.show', $user)
                        ->with('success', 'User updated successfully.');
    }

    public function destroy(User $user)
    {
        $this->authorize('delete', $user);

        // Prevent deleting the current user
        if ($user->id === auth()->id()) {
            return back()->withErrors(['error' => 'You cannot delete your own account.']);
        }

        $user->delete();

        return redirect()->route('admin.index')
                        ->with('success', 'User deleted successfully.');
    }
}
