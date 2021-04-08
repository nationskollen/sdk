export interface Nation {
    oid: number
    name: string
    short_name: string
    description: string
    icon_img_src: string | null
    cover_img_src: string | null
    accent_color: string
    locations: LocationCollection
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
    cover_img_src: string | null
}

export type NationCollection = Array<Nation>
export type LocationCollection = Array<Location>
