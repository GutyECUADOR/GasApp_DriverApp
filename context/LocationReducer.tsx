import { Location, Client } from "../interfaces/Location";

export interface LocationState {
    hasLocation: boolean;
    address: string;
    location: Location;
    clientLocation: Location;
    client: Client | null;
    hasPedidoActivo: boolean;
    pedidoActivoID: string;
    duration: number;
    distance: number;
    amount: number;
}



type LocationAction = | 
    { type: 'setLocation', payload: { location: Location }}
    | { type: 'setAddress', payload: string }
    | { type: 'setClientLocation', payload: { location: Location } }
    | { type: 'setClient', payload: { client: Client | null } }
    | { type: 'sethasLocation', payload: boolean }
    | { type: 'setHasPedidoActivo', payload: boolean }
    | { type: 'setPedidoActivoID', payload: string }
    | { type: 'setAmount', payload: number }
    | { type: 'setDistance', payload: number }
    | { type: 'setDuration', payload: number }

/* El reducer hace las vaces de useState complejo */

export const LocationReducer = ( state: LocationState, action: LocationAction) : LocationState => {
    switch (action.type) {
        case 'setLocation':
            return {
                ...state,
                location: action.payload.location
            }
            break;

        case 'setClientLocation':
            return {
                ...state,
                clientLocation: action.payload.location
            }
            break;

        case 'setClient':
            return {
                ...state,
                client: action.payload.client
            }
            break;

        case 'setAddress':
            return {
                ...state,
                address: action.payload
            }
            break;
        
        case 'sethasLocation':
            return {
                ...state,
                hasLocation: action.payload
            }
            break;

        case 'setHasPedidoActivo':
            return {
                ...state,
                hasPedidoActivo: action.payload
            }
            break;

        case 'setPedidoActivoID':
            return {
                ...state,
                pedidoActivoID: action.payload
            }
            break;

        case 'setAmount':
            return {
                ...state,
                amount: action.payload
            }
            break;

        case 'setDistance':
            return {
                ...state,
                distance: action.payload
            }
            break;

        case 'setDuration':
            return {
                ...state,
                duration: action.payload
            }
            break;

      
        default:
            return state;
            break;
    } 
}