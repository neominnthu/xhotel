import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import users from './users'
import roles from './roles'
import permissions from './permissions'
/**
* @see \App\Http\Controllers\Admin\AdminController::index
 * @see app/Http/Controllers/Admin/AdminController.php:18
 * @route '/admin'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AdminController::index
 * @see app/Http/Controllers/Admin/AdminController.php:18
 * @route '/admin'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminController::index
 * @see app/Http/Controllers/Admin/AdminController.php:18
 * @route '/admin'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AdminController::index
 * @see app/Http/Controllers/Admin/AdminController.php:18
 * @route '/admin'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\AdminController::index
 * @see app/Http/Controllers/Admin/AdminController.php:18
 * @route '/admin'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminController::index
 * @see app/Http/Controllers/Admin/AdminController.php:18
 * @route '/admin'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\AdminController::index
 * @see app/Http/Controllers/Admin/AdminController.php:18
 * @route '/admin'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
const admin = {
    index: Object.assign(index, index),
users: Object.assign(users, users),
roles: Object.assign(roles, roles),
permissions: Object.assign(permissions, permissions),
}

export default admin