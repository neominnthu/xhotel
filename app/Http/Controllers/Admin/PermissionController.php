<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Permission;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class PermissionController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:view-roles'); // Permissions are managed alongside roles
        $this->middleware('permission:create-roles')->only(['create', 'store']);
        $this->middleware('permission:edit-roles')->only(['edit', 'update']);
        $this->middleware('permission:delete-roles')->only('destroy');
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $permissions = Permission::query()
            ->withCount('roles')
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                      ->orWhere('display_name', 'like', "%{$search}%");
            })
            ->when($request->group, function ($query, $group) {
                $query->where('group', $group);
            })
            ->orderBy('group')
            ->orderBy('name')
            ->paginate(20);

        $groups = Permission::distinct()->pluck('group')->filter()->sort();

        return Inertia::render('admin/permissions/index', [
            'permissions' => $permissions,
            'groups' => $groups,
            'filters' => $request->only(['search', 'group']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $groups = Permission::distinct()->pluck('group')->filter()->sort();

        return Inertia::render('admin/permissions/create', [
            'groups' => $groups,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:128', 'unique:permissions'],
            'display_name' => ['required', 'string', 'max:128'],
            'group' => ['required', 'string', 'max:64'],
            'description' => ['nullable', 'string', 'max:255'],
        ]);

        Permission::create([
            'name' => $validated['name'],
            'display_name' => $validated['display_name'],
            'group' => $validated['group'],
            'description' => $validated['description'],
            'is_system_permission' => false,
        ]);

        return redirect()->route('admin.permissions.index')
                        ->with('success', 'Permission created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Permission $permission): Response
    {
        $permission->load(['roles']);

        return Inertia::render('admin/permissions/show', [
            'permission' => $permission,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Permission $permission): Response
    {
        // Prevent editing system permissions
        if ($permission->is_system_permission) {
            abort(403, 'System permissions cannot be edited.');
        }

        $groups = Permission::distinct()->pluck('group')->filter()->sort();

        return Inertia::render('admin/permissions/edit', [
            'permission' => $permission,
            'groups' => $groups,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Permission $permission)
    {
        // Prevent editing system permissions
        if ($permission->is_system_permission) {
            abort(403, 'System permissions cannot be edited.');
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:128', Rule::unique('permissions')->ignore($permission->id)],
            'display_name' => ['required', 'string', 'max:128'],
            'group' => ['required', 'string', 'max:64'],
            'description' => ['nullable', 'string', 'max:255'],
        ]);

        $permission->update($validated);

        return redirect()->route('admin.permissions.show', $permission)
                        ->with('success', 'Permission updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Permission $permission)
    {
        // Prevent deleting system permissions
        if ($permission->is_system_permission) {
            return back()->withErrors(['error' => 'System permissions cannot be deleted.']);
        }

        // Check if permission is assigned to any roles
        if ($permission->roles()->count() > 0) {
            return back()->withErrors(['error' => 'Cannot delete permission that is assigned to roles.']);
        }

        $permission->delete();

        return redirect()->route('admin.permissions.index')
                        ->with('success', 'Permission deleted successfully.');
    }
}
