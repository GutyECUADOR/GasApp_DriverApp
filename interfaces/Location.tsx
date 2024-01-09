export interface Location {
    latitude: number,
    longitude: number
}

export interface Delivery {
    coordinate: Location,
    name: string,
    email: string,
    phone: string
}