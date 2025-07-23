// backend/data/drivers.js
module.exports = [
  { 
    id: "driver1", 
    name: "Ramesh Kumar", 
    vehicleType: "Auto", 
    licensePlate: "AP16 XY1234", 
    currentLocation: { lat: 16.5100, lon: 80.6500 }, // Near Benz Circle
    status: "available" // available, on-trip, offline
  },
  { 
    id: "driver2", 
    name: "Sunita Reddy", 
    vehicleType: "Car", 
    licensePlate: "AP16 AB5678", 
    currentLocation: { lat: 16.4950, lon: 80.6350 }, // Near Mogalrajapuram
    status: "available" 
  },
  { 
    id: "driver3", 
    name: "Vijay Rao", 
    vehicleType: "Bike", 
    licensePlate: "AP16 CD9012", 
    currentLocation: { lat: 16.5250, lon: 80.6650 }, // Near Gannavaram
    status: "available" 
  }
];