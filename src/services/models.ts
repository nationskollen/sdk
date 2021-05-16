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
import {
    Menu,
    Event,
    Nation,
    Location,
    MenuItem,
    Individual,
    OpeningHour,
    ContactInformation,
} from '../responses'

export interface SubscriptionCreateData {
    oid: number
    topic: number
    token: string
}

export type NationCreateData = Omit<Nation, 'oid' | 'default_location'>

export type LocationCreateData = Omit<
    Location,
    'id' | 'nation_id' | 'opening_hours' | 'opening_hour_exceptions'
>

export type OpeningHourCreateData = Omit<OpeningHour, 'id' | 'location_id'>

export type MenuCreateData = Omit<Menu, 'id' | 'nation_id' | 'location_id'>

export type MenuItemCreateData = Omit<MenuItem, 'id' | 'menu_id'>

export type IndividualCreateData = Omit<Individual, 'id' | 'nation_id'>

export type ContactCreateData = Omit<ContactInformation, 'id' | 'nation_id'>

export interface EventCreateData
    extends Omit<Event, 'id' | 'nation_id' | 'location_id' | 'category'> {
    category_id: number
}
