import cancellationPolicies from './cancellation-policies'
import updates from './updates'
import auditLogs from './audit-logs'
import roomTypes from './room-types'
import rates from './rates'
const settings = {
    cancellationPolicies: Object.assign(cancellationPolicies, cancellationPolicies),
updates: Object.assign(updates, updates),
auditLogs: Object.assign(auditLogs, auditLogs),
roomTypes: Object.assign(roomTypes, roomTypes),
rates: Object.assign(rates, rates),
}

export default settings