// backend/data/menus.js
module.exports = [
  { 
    restaurantId: "rest1", 
    items: [
      { id: "dish1", name: "Chicken Biryani", description: "Aromatic basmati rice with marinated chicken.", price: 280, category: "Main Course", imageUrl: "https://via.placeholder.com/100?text=Biryani" },
      { id: "dish2", name: "Paneer Butter Masala", description: "Creamy cottage cheese in rich gravy.", price: 220, category: "Main Course", imageUrl: "https://via.placeholder.com/100?text=Paneer" },
      { id: "dish3", name: "Garlic Naan", description: "Soft bread with garlic.", price: 60, category: "Breads", imageUrl: "https://via.placeholder.com/100?text=Naan" },
      { id: "dish4", name: "Gulab Jamun", description: "Sweet fried milk solids.", price: 90, category: "Desserts", imageUrl: "https://via.placeholder.com/100?text=Gulab" }
    ]
  },
  { 
    restaurantId: "rest2", 
    items: [
      { id: "dish5", name: "Plain Dosa", description: "Crispy rice crepe.", price: 80, category: "Breakfast", imageUrl: "https://via.placeholder.com/100?text=Dosa" },
      { id: "dish6", name: "Masala Dosa", description: "Crispy dosa with potato filling.", price: 100, category: "Breakfast", imageUrl: "https://via.placeholder.com/100?text=MasalaDosa" },
      { id: "dish7", name: "Idli Sambar", description: "Soft steamed rice cakes with lentil soup.", price: 70, category: "Breakfast", imageUrl: "https://via.placeholder.com/100?text=Idli" }
    ]
  },
  { 
    restaurantId: "rest3", 
    items: [
      { id: "dish8", name: "Margherita Pizza", description: "Classic with tomato and mozzarella.", price: 350, category: "Pizza", imageUrl: "https://via.placeholder.com/100?text=Margherita" },
      { id: "dish9", name: "Pepperoni Pizza", description: "Spicy pepperoni on cheesy crust.", price: 450, category: "Pizza", imageUrl: "https://via.placeholder.com/100?text=Pepperoni" },
      { id: "dish10", name: "Garlic Bread", description: "Toasted bread with garlic butter.", price: 120, category: "Sides", imageUrl: "https://via.placeholder.com/100?text=GarlicBread" }
    ]
  },
  { 
    restaurantId: "rest4", 
    items: [
      { id: "dish11", name: "Classic Burger", description: "Beef patty, lettuce, tomato, onion.", price: 180, category: "Burgers", imageUrl: "https://via.placeholder.com/100?text=ClassicBurger" },
      { id: "dish12", name: "Chicken Zinger", description: "Crispy chicken fillet with special sauce.", price: 220, category: "Burgers", imageUrl: "https://via.placeholder.com/100?text=Zinger" },
      { id: "dish13", name: "French Fries (L)", description: "Crispy golden fries.", price: 100, category: "Sides", imageUrl: "https://via.placeholder.com/100?text=Fries" }
    ]
  }
];