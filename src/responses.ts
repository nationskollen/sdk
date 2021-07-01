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

export enum PermissionTypes {
    Events = 'Events',
    Menus = 'Menus',
    MenuItem = 'MenuItem',
    Individuals = 'Individuals',
    Nation = 'Nation',
    News = 'News',
    Users = 'Users',
    OpeningHours = 'OpeningHours',
    Locations = 'Locations',
    Contact = 'Contact',
    Activity = 'Activity',
    UserPermissions = 'UserPermissions',
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

export interface PermissionType {
    id: number
    type: string
}

export interface Permission {
    id: number
    permission_type_id: number
}

export interface Category {
    id: number
    name: string
}

export interface Nation {
    oid: number
    name: string
    short_name: string
    description: string
    icon_img_src: string | null
    pin_img_src: string | null
    cover_img_src: string | null
    accent_color: string | null
    default_location?: Location
}

export interface Event {
    id: number
    nation_id: number
    location_id: number | null
    name: string
    short_description: string
    cover_img_src: string | null
    only_members: boolean
    only_students: boolean
    occurs_at: string
    ends_at: string
    category?: Category
}

export interface EventDescription {
    long_description: string
    created_at: string
    updated_at: string
}

export interface Location {
    id: number
    nation_id: number
    name: string
    description: string
    address: string
    max_capacity: number
    estimated_people_count: number
    activity_level_disabled: boolean
    activity_level: number
    is_open: boolean
    is_default: boolean
    show_on_map: boolean
    latitude: number | null
    longitude: number | null
    cover_img_src: string | null
    opening_hours: OpeningHourCollection
    opening_hour_exceptions: OpeningHourCollection
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
    nation_id: number
    location_id: number
    name: string
    hidden: boolean
    cover_img_src: string | null
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
    id: number
    oid: number
    avatar_img_src: string | null
    nation_admin: boolean
    full_name: string
    email: string
    remember_me_token: string | null
    created_at: string
    updated_at: string
}

export interface SingleUser extends User {
    permissions: Array<Permissions>
}

export interface AuthenticatedUser extends User {
    type: string
    token: string
    scope: Scopes
}

export interface SubscriptionTopic {
    id: number
    name: string
}

export interface Subscription {
    nation_id: number
    subscription_topic_id: number
    uuid: string
}

export interface Notification {
    id: number
    nation_id: number
    subscription_topic_id: number
    title: string
    message: string
    created_at: string
}

export interface Individual {
    id: number
    nation_id: number
    name: string
    role: string | null
    description: string | null
    profile_img_src: string | null
}

export interface ContactInformation {
    id: number
    nation_id: number
    email: string
    telephone: string
    web_url?: string | null
}

export type UsersCollection = Array<User>
export type NationCollection = Array<Nation>
export type LocationCollection = Array<Location>
export type EventCollection = Array<Event>
export type MenuCollection = Array<Menu>
export type MenuItemCollection = Array<MenuItem>
export type OpeningHourCollection = Array<OpeningHour>
export type CategoryCollection = Array<Category>
export type PermissionsCollection = Array<Permission>
export type PermissionsTypeCollection = Array<PermissionType>
export type SubscriptionTopicCollection = Array<SubscriptionTopic>
export type SubscriptionCollection = Array<Subscription>
export type NotificationCollection = Array<Notification>
export type IndividualCollection = Array<Individual>
