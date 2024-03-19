export interface Location {
    latitude: number,
    longitude: number
}

export interface Client {
    coordinate: Location,
    name: string,
    email: string,
    phone: string
}