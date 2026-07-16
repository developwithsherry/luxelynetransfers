

export interface Vehicle {
    name: string;
    sittingCapacity:number;
    // fareFactor?: number;
    type?: string;
    laguageCapacity: string;
    description: string;
    imageUrl: string
    id:string | number
    minFare:number;
    hand_laguage:string
    fareSpots:fareSpot[]
}

export interface fareSpot{
    id:string;
    position:number;
    fareFactor:number;
    distance:number
    vehicleId:string
}

