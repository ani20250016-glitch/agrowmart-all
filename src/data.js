// src/data.js
export const shops = [
  {
    id: 1,
    name: "Apex Electronics",
    seller: "Ramesh Sharma",
    image: "https://th.bing.com/th/id/OIP.Gx1xaZCSbTU-VLbBN_shOQHaEK?w=395&h=187&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
    email: "support@apexelectronics.com",
    phone: "+1 (555) 123-4567",
    joined: "Jan 2022",
    rating: 4.7,
    reviews: 1245,
    products: 85,
  },
  {
    id: 2,
    name: "Tech World",
    seller: "Anita Verma",
    image: "https://th.bing.com/th/id/OIP.Gx1xaZCSbTU-VLbBN_shOQHaEK?w=395&h=187&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
    email: "support@techworld.com",
    phone: "+1 (555) 987-6543",
    joined: "Mar 2021",
    rating: 4.5,
    reviews: 800,
    products: 60,
  },
  {
    id: 3,
    name: "Gadget Hub",
    seller: "Suresh Kumar",
    image: "https://th.bing.com/th/id/OIP.Gx1xaZCSbTU-VLbBN_shOQHaEK?w=395&h=187&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
    email: "support@gadgethub.com",
    phone: "+1 (555) 111-2222",
    joined: "Jul 2020",
    rating: 4.8,
    reviews: 1500,
    products: 100,
  },
];

export const reviewsData = [
  { id: 1, product: "UltraView 4K Monitor", customer: "John Davis", rating: 4, review: "Great picture quality, but the stand is a bit wobbly.", date: "Oct 26, 2023", shopId: 1 },
  { id: 2, product: "ProGaming Headset X7", customer: "Emily Chen", rating: 5, review: "Excellent sound, very comfortable for long sessions!", date: "Oct 25, 2023", shopId: 1 },
  { id: 3, product: "SmartHome Hub V3", customer: "Michael Brown", rating: 3, review: "Setup was complicated and instructions unclear.", date: "Oct 24, 2023", shopId: 2 },
  { id: 4, product: "Wireless Charger Pad", customer: "Sarah Wilson", rating: 5, review: "Works perfectly with my phone, fast charging.", date: "Oct 23, 2023", shopId: 2 },
  { id: 5, product: "Bluetooth Speaker Mini", customer: "Chris Lee", rating: 4, review: "Decent sound for the size, good battery life.", date: "Oct 22, 2023", shopId: 3 },
];
