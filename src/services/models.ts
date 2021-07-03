/**
 * ## Resource models
 * Contains all the available resource models that are used to create and update
 * data on the server. This file contains the typings for the required data for
 * the different services.
 *
 * Note that these models may differ from the corresponding resource response.
 * You are only allowed to specify the properties defined in these models
 * when performing CRUD-operations. Specifying other properties may lead to
 * server errors.
 *
 * @module models
 */
import { Days } from '../responses'

export interface PermissionCreateData {
    user_id: number
    permission_type_id: number
}

export interface SubscriptionCreateData {
    oid: number
    topic: number
    token: string
}

export interface NationCreateData {
    name: string
    short_name: string
    description: string
    accent_color: string | null
}

export interface LocationCreateData {
    name: string
    description: string
    address: string
    max_capacity: number
    activity_level_disabled?: boolean
    is_default?: boolean
    show_on_map: boolean
    latitude?: number | null
    longitude?: number | null
}

export interface LocationActivityUpdateData {
    change?: number
    exact_amount?: number
}

export interface OpeningHourCreateData {
    type: number
    is_open: boolean
    day?: Days | null
    day_special?: string | null
    day_special_date?: string | null
    open?: string | null
    close?: string | null
}

export interface MenuCreateData {
    name: string
    hidden: boolean
}

export interface MenuItemCreateData {
    name: string
    description: string
    price: number
    hidden: boolean
}

export interface IndividualCreateData {
    name: string
    role?: string | null
    description?: string | null
}

export interface UsersCreateData {
    full_name: string
    email: string
    password: string
}

export interface ContactCreateData {
    email: string
    telephone: string
    web_url?: string | null
}

export interface EventCreateData {
    name: string
    short_description: string
    long_description: string
    occurs_at: string
    ends_at: string
    only_members?: boolean
    only_students?: boolean
    category_id?: number | null
    location_id?: number | null
}
