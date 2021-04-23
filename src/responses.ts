export enum Scopes {
    Admin = 'admin',
    Staff = 'staff',
    None = 'none',
}

export enum ActivityLevels {
    Closed,
    Low,
    Medium,
    High,
    VeryHigh,
    Full,
}

export enum OpeningHourType {
    Default,
    Exception,
}

export enum Days {
    Monday,
    Tuesday,
    Wednesday,
    Thursday,
    Friday,
    Saturday,
    Sunday,
}

export interface Nation {
    oid: number
    name: string
    short_name: string
    description: string
    icon_img_src: string | null
    cover_img_src: string | null
    accent_color: string | null
}

export interface Event {
    id: number
    nation_id: number
    location_id: number | null
    name: string
    description: string
    icon_img_src: string | null
    cover_img_src: string | null
    only_members: boolean
    only_students: boolean
    occurs_at: string
    ends_at: string
}

export interface Location {
    id: number
    nation_id: number
    name: string
    description: string
    address: string
    max_capacity: number
    estimated_people_count: number
    activity_level: number
    is_open: boolean
    show_on_map: boolean
    latitude: number | null
    longitute: number | null
    cover_img_src: string | null
    opening_hours: OpeningHourCollection
    opening_hours_exceptions: OpeningHourCollection
}

export interface OpeningHour {
    id: number
    location_id: number
    type: number
    day: Days | null
    day_special: string | null
    day_special_date: string | null
    open: string | null
    close: string | null
    is_open: boolean
}

export interface Menu {
    id: number
    oid: number
    location_id: number
    name: string
    hidden: boolean
    items: MenuItemCollection
}

export interface MenuItem {
    id: number
    menu_id: number
    name: string
    description: string
    price: number
    cover_img_src: string | null
    hidden: boolean
}

export interface User {
    type: string
    token: string
    scope: Scopes
    oid: number
}

export type NationCollection = Array<Nation>
export type LocationCollection = Array<Location>
export type EventCollection = Array<Event>
export type MenuCollection = Array<Menu>
export type MenuItemCollection = Array<MenuItem>
export type OpeningHourCollection = Array<OpeningHour>
