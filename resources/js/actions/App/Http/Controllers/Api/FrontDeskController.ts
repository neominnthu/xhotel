import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\FrontDeskController::dashboard
 * @see app/Http/Controllers/Api/FrontDeskController.php:30
 * @route '/api/v1/front-desk/dashboard'
 */
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/api/v1/front-desk/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\FrontDeskController::dashboard
 * @see app/Http/Controllers/Api/FrontDeskController.php:30
 * @route '/api/v1/front-desk/dashboard'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\FrontDeskController::dashboard
 * @see app/Http/Controllers/Api/FrontDeskController.php:30
 * @route '/api/v1/front-desk/dashboard'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\FrontDeskController::dashboard
 * @see app/Http/Controllers/Api/FrontDeskController.php:30
 * @route '/api/v1/front-desk/dashboard'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\FrontDeskController::dashboard
 * @see app/Http/Controllers/Api/FrontDeskController.php:30
 * @route '/api/v1/front-desk/dashboard'
 */
    const dashboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: dashboard.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\FrontDeskController::dashboard
 * @see app/Http/Controllers/Api/FrontDeskController.php:30
 * @route '/api/v1/front-desk/dashboard'
 */
        dashboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\FrontDeskController::dashboard
 * @see app/Http/Controllers/Api/FrontDeskController.php:30
 * @route '/api/v1/front-desk/dashboard'
 */
        dashboardForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    dashboard.form = dashboardForm
/**
* @see \App\Http\Controllers\Api\FrontDeskController::checkIn
 * @see app/Http/Controllers/Api/FrontDeskController.php:82
 * @route '/api/v1/front-desk/reservations/{reservation}/check-in'
 */
export const checkIn = (args: { reservation: number | { id: number } } | [reservation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: checkIn.url(args, options),
    method: 'post',
})

checkIn.definition = {
    methods: ["post"],
    url: '/api/v1/front-desk/reservations/{reservation}/check-in',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\FrontDeskController::checkIn
 * @see app/Http/Controllers/Api/FrontDeskController.php:82
 * @route '/api/v1/front-desk/reservations/{reservation}/check-in'
 */
checkIn.url = (args: { reservation: number | { id: number } } | [reservation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { reservation: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { reservation: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    reservation: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        reservation: typeof args.reservation === 'object'
                ? args.reservation.id
                : args.reservation,
                }

    return checkIn.definition.url
            .replace('{reservation}', parsedArgs.reservation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\FrontDeskController::checkIn
 * @see app/Http/Controllers/Api/FrontDeskController.php:82
 * @route '/api/v1/front-desk/reservations/{reservation}/check-in'
 */
checkIn.post = (args: { reservation: number | { id: number } } | [reservation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: checkIn.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\FrontDeskController::checkIn
 * @see app/Http/Controllers/Api/FrontDeskController.php:82
 * @route '/api/v1/front-desk/reservations/{reservation}/check-in'
 */
    const checkInForm = (args: { reservation: number | { id: number } } | [reservation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: checkIn.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\FrontDeskController::checkIn
 * @see app/Http/Controllers/Api/FrontDeskController.php:82
 * @route '/api/v1/front-desk/reservations/{reservation}/check-in'
 */
        checkInForm.post = (args: { reservation: number | { id: number } } | [reservation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: checkIn.url(args, options),
            method: 'post',
        })
    
    checkIn.form = checkInForm
/**
* @see \App\Http\Controllers\Api\FrontDeskController::checkOut
 * @see app/Http/Controllers/Api/FrontDeskController.php:106
 * @route '/api/v1/front-desk/stays/{stay}/check-out'
 */
export const checkOut = (args: { stay: number | { id: number } } | [stay: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: checkOut.url(args, options),
    method: 'post',
})

checkOut.definition = {
    methods: ["post"],
    url: '/api/v1/front-desk/stays/{stay}/check-out',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\FrontDeskController::checkOut
 * @see app/Http/Controllers/Api/FrontDeskController.php:106
 * @route '/api/v1/front-desk/stays/{stay}/check-out'
 */
checkOut.url = (args: { stay: number | { id: number } } | [stay: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { stay: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { stay: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    stay: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        stay: typeof args.stay === 'object'
                ? args.stay.id
                : args.stay,
                }

    return checkOut.definition.url
            .replace('{stay}', parsedArgs.stay.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\FrontDeskController::checkOut
 * @see app/Http/Controllers/Api/FrontDeskController.php:106
 * @route '/api/v1/front-desk/stays/{stay}/check-out'
 */
checkOut.post = (args: { stay: number | { id: number } } | [stay: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: checkOut.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\FrontDeskController::checkOut
 * @see app/Http/Controllers/Api/FrontDeskController.php:106
 * @route '/api/v1/front-desk/stays/{stay}/check-out'
 */
    const checkOutForm = (args: { stay: number | { id: number } } | [stay: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: checkOut.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\FrontDeskController::checkOut
 * @see app/Http/Controllers/Api/FrontDeskController.php:106
 * @route '/api/v1/front-desk/stays/{stay}/check-out'
 */
        checkOutForm.post = (args: { stay: number | { id: number } } | [stay: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: checkOut.url(args, options),
            method: 'post',
        })
    
    checkOut.form = checkOutForm
/**
* @see \App\Http\Controllers\Api\FrontDeskController::searchGuests
 * @see app/Http/Controllers/Api/FrontDeskController.php:125
 * @route '/api/v1/front-desk/guests/search'
 */
export const searchGuests = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: searchGuests.url(options),
    method: 'get',
})

searchGuests.definition = {
    methods: ["get","head"],
    url: '/api/v1/front-desk/guests/search',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\FrontDeskController::searchGuests
 * @see app/Http/Controllers/Api/FrontDeskController.php:125
 * @route '/api/v1/front-desk/guests/search'
 */
searchGuests.url = (options?: RouteQueryOptions) => {
    return searchGuests.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\FrontDeskController::searchGuests
 * @see app/Http/Controllers/Api/FrontDeskController.php:125
 * @route '/api/v1/front-desk/guests/search'
 */
searchGuests.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: searchGuests.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\FrontDeskController::searchGuests
 * @see app/Http/Controllers/Api/FrontDeskController.php:125
 * @route '/api/v1/front-desk/guests/search'
 */
searchGuests.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: searchGuests.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\FrontDeskController::searchGuests
 * @see app/Http/Controllers/Api/FrontDeskController.php:125
 * @route '/api/v1/front-desk/guests/search'
 */
    const searchGuestsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: searchGuests.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\FrontDeskController::searchGuests
 * @see app/Http/Controllers/Api/FrontDeskController.php:125
 * @route '/api/v1/front-desk/guests/search'
 */
        searchGuestsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: searchGuests.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\FrontDeskController::searchGuests
 * @see app/Http/Controllers/Api/FrontDeskController.php:125
 * @route '/api/v1/front-desk/guests/search'
 */
        searchGuestsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: searchGuests.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    searchGuests.form = searchGuestsForm
/**
* @see \App\Http\Controllers\Api\FrontDeskController::getGuest
 * @see app/Http/Controllers/Api/FrontDeskController.php:152
 * @route '/api/v1/front-desk/guests/{guest}'
 */
export const getGuest = (args: { guest: number | { id: number } } | [guest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getGuest.url(args, options),
    method: 'get',
})

getGuest.definition = {
    methods: ["get","head"],
    url: '/api/v1/front-desk/guests/{guest}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\FrontDeskController::getGuest
 * @see app/Http/Controllers/Api/FrontDeskController.php:152
 * @route '/api/v1/front-desk/guests/{guest}'
 */
getGuest.url = (args: { guest: number | { id: number } } | [guest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { guest: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { guest: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    guest: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        guest: typeof args.guest === 'object'
                ? args.guest.id
                : args.guest,
                }

    return getGuest.definition.url
            .replace('{guest}', parsedArgs.guest.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\FrontDeskController::getGuest
 * @see app/Http/Controllers/Api/FrontDeskController.php:152
 * @route '/api/v1/front-desk/guests/{guest}'
 */
getGuest.get = (args: { guest: number | { id: number } } | [guest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getGuest.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\FrontDeskController::getGuest
 * @see app/Http/Controllers/Api/FrontDeskController.php:152
 * @route '/api/v1/front-desk/guests/{guest}'
 */
getGuest.head = (args: { guest: number | { id: number } } | [guest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getGuest.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\FrontDeskController::getGuest
 * @see app/Http/Controllers/Api/FrontDeskController.php:152
 * @route '/api/v1/front-desk/guests/{guest}'
 */
    const getGuestForm = (args: { guest: number | { id: number } } | [guest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getGuest.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\FrontDeskController::getGuest
 * @see app/Http/Controllers/Api/FrontDeskController.php:152
 * @route '/api/v1/front-desk/guests/{guest}'
 */
        getGuestForm.get = (args: { guest: number | { id: number } } | [guest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getGuest.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\FrontDeskController::getGuest
 * @see app/Http/Controllers/Api/FrontDeskController.php:152
 * @route '/api/v1/front-desk/guests/{guest}'
 */
        getGuestForm.head = (args: { guest: number | { id: number } } | [guest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getGuest.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getGuest.form = getGuestForm
/**
* @see \App\Http\Controllers\Api\FrontDeskController::assignRoom
 * @see app/Http/Controllers/Api/FrontDeskController.php:184
 * @route '/api/v1/front-desk/stays/{stay}/assign-room'
 */
export const assignRoom = (args: { stay: number | { id: number } } | [stay: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: assignRoom.url(args, options),
    method: 'post',
})

assignRoom.definition = {
    methods: ["post"],
    url: '/api/v1/front-desk/stays/{stay}/assign-room',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\FrontDeskController::assignRoom
 * @see app/Http/Controllers/Api/FrontDeskController.php:184
 * @route '/api/v1/front-desk/stays/{stay}/assign-room'
 */
assignRoom.url = (args: { stay: number | { id: number } } | [stay: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { stay: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { stay: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    stay: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        stay: typeof args.stay === 'object'
                ? args.stay.id
                : args.stay,
                }

    return assignRoom.definition.url
            .replace('{stay}', parsedArgs.stay.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\FrontDeskController::assignRoom
 * @see app/Http/Controllers/Api/FrontDeskController.php:184
 * @route '/api/v1/front-desk/stays/{stay}/assign-room'
 */
assignRoom.post = (args: { stay: number | { id: number } } | [stay: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: assignRoom.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\FrontDeskController::assignRoom
 * @see app/Http/Controllers/Api/FrontDeskController.php:184
 * @route '/api/v1/front-desk/stays/{stay}/assign-room'
 */
    const assignRoomForm = (args: { stay: number | { id: number } } | [stay: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: assignRoom.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\FrontDeskController::assignRoom
 * @see app/Http/Controllers/Api/FrontDeskController.php:184
 * @route '/api/v1/front-desk/stays/{stay}/assign-room'
 */
        assignRoomForm.post = (args: { stay: number | { id: number } } | [stay: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: assignRoom.url(args, options),
            method: 'post',
        })
    
    assignRoom.form = assignRoomForm
/**
* @see \App\Http\Controllers\Api\FrontDeskController::getAvailableRooms
 * @see app/Http/Controllers/Api/FrontDeskController.php:207
 * @route '/api/v1/front-desk/rooms/available'
 */
export const getAvailableRooms = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getAvailableRooms.url(options),
    method: 'get',
})

getAvailableRooms.definition = {
    methods: ["get","head"],
    url: '/api/v1/front-desk/rooms/available',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\FrontDeskController::getAvailableRooms
 * @see app/Http/Controllers/Api/FrontDeskController.php:207
 * @route '/api/v1/front-desk/rooms/available'
 */
getAvailableRooms.url = (options?: RouteQueryOptions) => {
    return getAvailableRooms.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\FrontDeskController::getAvailableRooms
 * @see app/Http/Controllers/Api/FrontDeskController.php:207
 * @route '/api/v1/front-desk/rooms/available'
 */
getAvailableRooms.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getAvailableRooms.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\FrontDeskController::getAvailableRooms
 * @see app/Http/Controllers/Api/FrontDeskController.php:207
 * @route '/api/v1/front-desk/rooms/available'
 */
getAvailableRooms.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getAvailableRooms.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\FrontDeskController::getAvailableRooms
 * @see app/Http/Controllers/Api/FrontDeskController.php:207
 * @route '/api/v1/front-desk/rooms/available'
 */
    const getAvailableRoomsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getAvailableRooms.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\FrontDeskController::getAvailableRooms
 * @see app/Http/Controllers/Api/FrontDeskController.php:207
 * @route '/api/v1/front-desk/rooms/available'
 */
        getAvailableRoomsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getAvailableRooms.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\FrontDeskController::getAvailableRooms
 * @see app/Http/Controllers/Api/FrontDeskController.php:207
 * @route '/api/v1/front-desk/rooms/available'
 */
        getAvailableRoomsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getAvailableRooms.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getAvailableRooms.form = getAvailableRoomsForm
const FrontDeskController = { dashboard, checkIn, checkOut, searchGuests, getGuest, assignRoom, getAvailableRooms }

export default FrontDeskController