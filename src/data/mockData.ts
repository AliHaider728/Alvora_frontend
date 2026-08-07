import { Category, AgeGroupOption, Product, Review, Order, Customer, Coupon, StoreSettings } from '../types';
import { DEFAULT_HOMEPAGE_SECTIONS, DEFAULT_STOREFRONT_NAVIGATION } from '../config/storeAppearance';

export const INITIAL_SETTINGS: StoreSettings = {
  storeName: "PlayBimboo",
  tagline: "Where Imagination Takes Flight!",
  email: "sales@playbimboo.com",
  phone: "+327-6655557",
  address: "Mumtaz Market, Shafique Center, Gujranwala, Pakistan",
  currency: "Rs.",
  metaTitle: "PlayBimboo - Magical Toys, Games & Educational Play",
  metaDescription: "Discover top-rated toys, action figures, board games, plush soft toys, and educational STEM play for kids of all ages. Fast shipping across Pakistan!",
  freeShippingThreshold: 5000,
  standardShippingFee: 250,
  taxRate: 0.05,
  storefrontNavigation: DEFAULT_STOREFRONT_NAVIGATION.map(item => ({ ...item })),
  homepageSections: DEFAULT_HOMEPAGE_SECTIONS.map(item => ({ ...item })),
};

export const AGE_GROUPS: AgeGroupOption[] = [
  { id: '0-2', name: 'Toddlers (0-2 Yrs)', label: '0 - 2 Yrs', range: '0-2', color: 'bg-amber-100 text-amber-800 border-amber-300', icon: 'Baby' },
  { id: '3-5', name: 'Preschool (3-5 Yrs)', label: '3 - 5 Yrs', range: '3-5', color: 'bg-rose-100 text-rose-800 border-rose-300', icon: 'Blocks' },
  { id: '6-8', name: 'Early Grades (6-8 Yrs)', label: '6 - 8 Yrs', range: '6-8', color: 'bg-sky-100 text-sky-800 border-sky-300', icon: 'Rocket' },
  { id: '9-12', name: 'Big Kids (9-12 Yrs)', label: '9 - 12 Yrs', range: '9-12', color: 'bg-purple-100 text-purple-800 border-purple-300', icon: 'Gamepad2' },
  { id: '13+', name: 'Teens (13+ Yrs)', label: '13+ Yrs', range: '13+', color: 'bg-indigo-100 text-indigo-800 border-indigo-300', icon: 'Gamepad2' },
];

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    name: 'Building Sets & Blocks',
    slug: 'building-sets',
    iconName: 'Boxes',
    image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=600&q=80',
    description: 'Spark creativity with architectural blocks, LEGO-style kits, and magnetic tiles.',
    itemCount: 14,
  },
  {
    id: 'cat-2',
    name: 'Action Figures & Playsets',
    slug: 'action-figures',
    iconName: 'Shield',
    image: 'https://images.unsplash.com/photo-1608889825205-eebdb9fc5806?auto=format&fit=crop&w=600&q=80',
    description: 'Superheroes, dinosaurs, anime characters, and epic fantasy playsets.',
    itemCount: 18,
  },
  {
    id: 'cat-3',
    name: 'Educational & STEM',
    slug: 'educational-stem',
    iconName: 'GraduationCap',
    image: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=600&q=80',
    description: 'Science experiments, robotics, math puzzles, and interactive coding robots.',
    itemCount: 12,
  },
  {
    id: 'cat-4',
    name: 'Plush & Soft Toys',
    slug: 'soft-toys',
    iconName: 'Heart',
    image: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=600&q=80',
    description: 'Cuddly teddy bears, squishy stuffed animals, and comforting plush companions.',
    itemCount: 16,
  },
  {
    id: 'cat-5',
    name: 'Outdoor & Active Play',
    slug: 'outdoor-toys',
    iconName: 'Sun',
    image: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=600&q=80',
    description: 'Kites, ride-on cars, water blasters, sports equipment, and backyard play.',
    itemCount: 10,
  },
  {
    id: 'cat-6',
    name: 'Board Games & Puzzles',
    slug: 'board-games',
    iconName: 'Dices',
    image: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=600&q=80',
    description: 'Family strategy games, card games, memory matches, and 1000-piece puzzles.',
    itemCount: 15,
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p-101',
    name: 'Galaxy Explorer Cosmic Rocket Ship',
    slug: 'galaxy-explorer-cosmic-rocket-ship',
    price: 4999,
    originalPrice: 6499,
    discountPercent: 23,
    rating: 4.9,
    reviewCount: 42,
    category: 'Building Sets & Blocks',
    categorySlug: 'building-sets',
    ageGroups: ['6-8'],
    brand: 'SpaceCraft Toys',
    inStock: true,
    stockQuantity: 24,
    isVisible: true,
    variants: [
      { id: "g" + Math.random().toString(36).substring(7), name: "Color Edition", options: [{ id: 'v' + Date.now() + 0, name: 'Cosmic Red', priceOffset: 0, inStock: true }, { id: 'v' + Date.now() + 1, name: 'Lunar Silver', priceOffset: 0, inStock: true }, { id: 'v' + Date.now() + 2, name: 'Deep Space Blue', priceOffset: 0, inStock: true }] }
    ],
    images: [
      'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Launch into deep space adventure! This 580-piece building set features an opening launch capsule, detachable lunar rover, 3 astronaut mini-figures, and glowing engine thrusters.',
    features: [
      '580 precision snap-fit building bricks',
      'Includes 3 astronaut mini-figures & alien pet',
      'Working launch pad lift & glowing thruster lights',
      'Compatible with major building block brands'
    ],
    safetyInfo: 'Non-toxic ABS plastic. Choking hazard: Small parts. Not suitable for children under 3 years.',
    specifications: {
      'Dimensions': '14.5" x 8.2" x 18.0"',
      'Material': 'BPA-Free Recyclable ABS',
      'Weight': '2.4 lbs',
      'Assembly Time': 'Approx. 90 mins'
    },
    isFeatured: true,
    isBestseller: true,
    tags: ['space', 'building blocks', 'bestseller', 'glow in dark'],
    metaTitle: 'Galaxy Explorer Cosmic Rocket Ship Building Set - PlayBimboo',
    metaDescription: 'Buy Galaxy Explorer Cosmic Rocket Ship. 580-piece space rocket building set for kids 6-8 with glowing thrusters & astronaut figures.'
  },
  {
    id: 'p-102',
    name: 'CuddlePal Plush Giant Teddy Bear (30 Inch) - Sold Out',
    slug: 'cuddlepal-plush-giant-teddy-bear',
    price: 3499,
    originalPrice: 3999,
    discountPercent: 12,
    rating: 4.8,
    reviewCount: 56,
    category: 'Plush & Soft Toys',
    categorySlug: 'soft-toys',
    ageGroups: ['0-2'],
    brand: 'HuggyFriends',
    inStock: false,
    stockQuantity: 0,
    images: [
      'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Ultra-soft, velvet-feel plush teddy bear designed for cozy bedtime hugs. Embroidered safe eyes with hypoallergenic cotton filling.',
    features: [
      '30 inches tall - super cuddly size',
      '100% hypoallergenic memory stuffing',
      'Machine washable gently on cold cycle',
      'Child-safe lock stitched seams'
    ],
    safetyInfo: 'ASTM F963 certified safe for newborns and toddlers.',
    specifications: {
      'Height': '30 inches (76 cm)',
      'Material': 'Ultra-soft Micro-fleece',
      'Care': 'Machine Washable'
    },
    isFeatured: true,
    isBestseller: true,
    tags: ['plush', 'teddy bear', 'soft', 'toddler'],
    metaTitle: 'Giant CuddlePal Plush Teddy Bear - PlayBimboo',
    metaDescription: 'Super soft 30 inch giant plush teddy bear for toddlers and babies. Hypoallergenic, safe, and washable.'
  },
  {
    id: 'p-103',
    name: 'RoboBot Junior STEM Coding Robot',
    slug: 'robobot-junior-stem-coding-robot',
    price: 6999,
    originalPrice: 8999,
    discountPercent: 22,
    rating: 4.9,
    reviewCount: 38,
    category: 'Educational & STEM',
    categorySlug: 'educational-stem',
    ageGroups: ['6-8'],
    brand: 'TechKidz',
    inStock: true,
    stockQuantity: 15,
    isVisible: true,
    variants: [
      { id: 'g1', name: 'Color', options: [{ id: 'v' + Date.now() + 0, name: 'Neon Blue', priceOffset: 0, inStock: true }, { id: 'v' + Date.now() + 1, name: 'Bright Yellow', priceOffset: 0, inStock: true }, { id: 'v' + Date.now() + 2, name: 'Robo Silver', priceOffset: 0, inStock: true }] }
    ],
    images: [
      'https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Teach kids logic and coding without screens! RoboBot uses coding cards and button commands to navigate mazes, play music, and draw shapes.',
    features: [
      'Screen-free early coding experience',
      'Obstacle detection sensors & LED face reactions',
      '30 challenge cards included for guided logic learning',
      'Rechargeable via USB-C'
    ],
    safetyInfo: 'Requires adult supervision for charging. Non-toxic plastic shell.',
    specifications: {
      'Battery': 'Built-in 1200mAh USB Rechargeable',
      'Connectivity': 'Screen-Free Push Button / Optical Card',
      'Ages': '6 to 8 Years'
    },
    isFeatured: true,
    isNewArrival: true,
    tags: ['robot', 'coding', 'STEM', 'educational'],
    metaTitle: 'RoboBot Junior STEM Coding Robot - PlayBimboo',
    metaDescription: 'Screen-free coding robot toy for kids aged 6-8. Includes challenge cards and smart sensors.'
  },
  {
    id: 'p-104',
    name: 'Super Speedster RC Monster Stunt Truck',
    slug: 'super-speedster-rc-monster-stunt-truck',
    price: 3999,
    originalPrice: 4999,
    discountPercent: 20,
    rating: 4.7,
    reviewCount: 29,
    category: 'Outdoor & Active Play',
    categorySlug: 'outdoor-toys',
    ageGroups: ['9-12'],
    brand: 'NitroWheels',
    inStock: true,
    stockQuantity: 30,
    isVisible: true,
    variants: [
      { id: "g" + Math.random().toString(36).substring(7), name: "Play", options: [{ id: 'v17854162409740', name: 'Single Player', priceOffset: 0, inStock: true }, { id: 'v17854162409741', name: 'Multiplayer', priceOffset: 0, inStock: true }] },
      { id: "g" + Math.random().toString(36).substring(7), name: "Color", options: [{ id: 'v' + Date.now() + 0, name: 'Red Monster', priceOffset: 0, inStock: true }, { id: 'v' + Date.now() + 1, name: 'Green Viper', priceOffset: 0, inStock: true }, { id: 'v' + Date.now() + 2, name: 'Blue Cyclone', priceOffset: 0, inStock: true }] }
    ],
    images: [
      'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=800&q=80'
    ],
    description: '360° flips, double-sided driving, and high-speed off-road action! Comes with all-terrain shock rubber tires and 2.4GHz remote control.',
    features: [
      '360-degree rotation and double-sided flipping',
      '2.4GHz anti-interference controller (100 ft range)',
      'Includes 2 rechargeable battery packs for 40 mins play',
      'LED headlight night effects'
    ],
    safetyInfo: 'For outdoor and indoor smooth surfaces. Contains small rechargeable lithium battery.',
    specifications: {
      'Top Speed': '15 MPH (24 km/h)',
      'Play Time': '40 mins (2 batteries)',
      'Scale': '1:18'
    },
    isFeatured: false,
    isNewArrival: true,
    tags: ['rc car', 'outdoor', 'stunt', 'remote control'],
    metaTitle: 'Super Speedster RC Monster Stunt Truck - PlayBimboo',
    metaDescription: 'High-speed RC Monster Stunt Truck with 360 degree flips and 2.4GHz remote control.'
  },
  {
    id: 'p-105',
    name: 'MagnaTiles 100-Piece Rainbow Magnetic Building Set',
    slug: 'magnatiles-100-piece-rainbow-magnetic-building-set',
    price: 7999,
    originalPrice: 8999,
    discountPercent: 11,
    rating: 5.0,
    reviewCount: 88,
    category: 'Building Sets & Blocks',
    categorySlug: 'building-sets',
    ageGroups: ['3-5'],
    brand: 'MagnaCraft',
    inStock: true,
    stockQuantity: 40,
    images: [
      'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Build castles, towers, 3D geometric shapes, and colorful stained-glass windows! Super strong rivets and food-grade ABS material.',
    features: [
      '100 vibrant translucent magnetic tiles',
      'Sonic-welded with safety rivets to secure magnets',
      'Develops spatial thinking and geometry skills',
      'STEM approved for toddlers and young builders'
    ],
    safetyInfo: 'Food-grade BPA free ABS plastic. Magnets securely encapsulated.',
    specifications: {
      'Piece Count': '100 tiles (Squares, Triangles, Doors)',
      'Material': 'BPA-Free Translucent ABS Plastic',
      'Age Group': '3-5 Years'
    },
    isFeatured: true,
    isBestseller: true,
    tags: ['magnetic', 'tiles', 'stem', 'building'],
    metaTitle: '100-Piece Rainbow Magnetic Building Tiles Set - Play Bimboo',
    metaDescription: 'Top-rated 100-piece magnetic building tiles for toddlers & kids. Safe, durable STEM toy.'
  },
  {
    id: 'p-106',
    name: 'Safari Quest 3D Wooden Animal Puzzle',
    slug: 'safari-quest-3d-wooden-animal-puzzle',
    price: 1999,
    originalPrice: 2499,
    discountPercent: 20,
    rating: 4.6,
    reviewCount: 19,
    category: 'Board Games & Puzzles',
    categorySlug: 'board-games',
    ageGroups: ['3-5'],
    brand: 'EcoWood Toys',
    inStock: true,
    stockQuantity: 22,
    images: [
      'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Natural wooden chunky puzzle featuring lions, elephants, giraffes, and zebras. Double-sided painted with non-toxic water-based eco paint.',
    features: [
      '12 thick wooden standing animal pieces',
      'Smooth rounded edges safe for tiny hands',
      'Encourages fine motor skills and animal recognition',
      'Sustainably sourced birch wood'
    ],
    safetyInfo: 'Water-based non-toxic paint. Smooth polished edges.',
    specifications: {
      'Wood Type': 'FSC Certified Sustainable Birch',
      'Dimensions': '11.8" x 8.8"',
      'Age': '2 - 5 Years'
    },
    isFeatured: false,
    isNewArrival: false,
    tags: ['wooden toy', 'puzzle', 'safari', 'montessori'],
    metaTitle: 'Safari Quest 3D Wooden Animal Puzzle - Play Bimboo',
    metaDescription: 'Eco-friendly wooden 3D safari animal puzzle for toddlers and kids.'
  },
  {
    id: 'p-107',
    name: 'Mythic Heroes Dragon Guardian Playset',
    slug: 'mythic-heroes-dragon-guardian-playset',
    price: 4499,
    originalPrice: 5499,
    discountPercent: 18,
    rating: 4.9,
    reviewCount: 31,
    category: 'Action Figures & Playsets',
    categorySlug: 'action-figures',
    ageGroups: ['6-8'],
    brand: 'Mythic Realm',
    inStock: true,
    stockQuantity: 12,
    images: [
      'https://images.unsplash.com/photo-1608889825205-eebdb9fc5806?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Command the fire dragon! Poseable wings, roaring sound effects, light-up flame breath, and 2 knight warrior figures with illuminated swords.',
    features: [
      'Flapping wings & mechanical jaw opening',
      'Sound effect roaring & LED red breath light',
      'Includes 2 knight action figures with shields & swords',
      '14-inch dragon wingspan'
    ],
    safetyInfo: 'Includes 3 LR44 button batteries securely screwed in battery door.',
    specifications: {
      'Dragon Length': '16 inches',
      'Batteries': 'Included (3x LR44)',
      'Articulation': '11 points of movement'
    },
    isFeatured: true,
    isBestseller: false,
    tags: ['dragon', 'action figure', 'fantasy', 'knights'],
    metaTitle: 'Mythic Dragon Guardian Action Playset - Play Bimboo',
    metaDescription: 'Roaring light-up dragon action figure playset with knight warriors.'
  },
  {
    id: 'p-108',
    name: 'WonderLand Junior Family Board Game',
    slug: 'wonderland-junior-family-board-game',
    price: 2499,
    originalPrice: 2999,
    discountPercent: 16,
    rating: 4.8,
    reviewCount: 52,
    category: 'Board Games & Puzzles',
    categorySlug: 'board-games',
    ageGroups: ['6-8'],
    brand: 'FunFamily Games',
    inStock: true,
    stockQuantity: 35,
    images: [
      'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'An exciting cooperative family board game where players work together to build a magical kingdom before sunset! Easy rules, high replayability.',
    features: [
      '2 to 4 players, 20 minute quick game rounds',
      'Encourages teamwork and decision making',
      'Vibrant gameboard with 3D cardboard castles',
      'Award winner for Best Preschool Family Game'
    ],
    safetyInfo: 'Recyclable cardboard & non-toxic game pieces.',
    specifications: {
      'Players': '2 - 4 Players',
      'Play Time': '15 - 25 Mins',
      'Age': '5 Years and Up'
    },
    isFeatured: false,
    isBestseller: true,
    tags: ['board game', 'family', 'cooperative', 'kids game'],
    metaTitle: 'WonderLand Junior Family Cooperative Board Game - Play Bimboo',
    metaDescription: 'Fun family cooperative board game for kids 5+. Easy to learn & fast rounds.'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    productId: 'p-101',
    reviewerName: 'Sarah Jenkins',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    createdAt: '2026-06-15',
    title: 'Absolute favorite present for my 7yo!',
    content: 'My son built this over the weekend and hasn’t stopped playing with the thruster lights and astronaut figures. The instructions were crystal clear.',
    verifiedPurchase: true,
    source: 'customer',
    status: 'approved'
  },
  {
    id: 'rev-2',
    productId: 'p-101',
    reviewerName: 'David Miller',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    createdAt: '2026-07-02',
    title: 'Sturdy blocks, fits with our existing set',
    content: 'Great quality bricks! Better than expensive branded ones and the glowing engine effect is super cool.',
    verifiedPurchase: true,
    source: 'customer',
    status: 'approved'
  },
  {
    id: 'rev-3',
    productId: 'p-102',
    reviewerName: 'Emily Watson',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    createdAt: '2026-07-10',
    title: 'So soft and huge!',
    content: 'Bought this for my toddler daughter’s reading corner. It is huge, plush, and smells super clean out of the package.',
    verifiedPurchase: true,
    source: 'customer',
    status: 'approved'
  },
  {
    id: 'rev-4',
    productId: 'p-103',
    reviewerName: 'Marcus Vance',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    createdAt: '2026-07-20',
    title: 'Awesome screen-free STEM toy',
    content: 'As a computer science teacher, I am impressed by how easily this teaches sequencing logic without putting a tablet in front of my 6 year old.',
    verifiedPurchase: true,
    source: 'customer',
    status: 'approved'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-9021',
    date: '2026-07-28 14:22',
    customerName: 'Sarah Jenkins',
    email: 'sarah.j@example.com',
    phone: '+1 555-0192',
    items: [
      { productId: 'p-101', name: 'Galaxy Explorer Cosmic Rocket Ship', quantity: 1, price: 4999, image: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=200&q=80' },
      { productId: 'p-106', name: 'Safari Quest 3D Wooden Animal Puzzle', quantity: 1, price: 1999, image: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=200&q=80' }
    ],
    subtotal: 6998,
    discount: 500,
    shipping: 0,
    total: 6498,
    status: 'Processing',
    shippingAddress: {
      fullName: 'Sarah Jenkins',
      street: '742 Evergreen Terrace',
      city: 'Springfield',
      state: 'CA',
      postalCode: '97477',
      country: 'USA'
    },
    paymentMethod: 'Cash on Delivery (COD)',
    trackingNumber: 'TRK-88291029'
  },
  {
    id: 'ORD-9020',
    date: '2026-07-27 10:15',
    customerName: 'David Miller',
    email: 'david.m@example.com',
    phone: '+1 555-0811',
    items: [
      { productId: 'p-105', name: 'MagnaTiles 100-Piece Rainbow Magnetic Building Set', quantity: 1, price: 7999, image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=200&q=80' }
    ],
    subtotal: 7999,
    discount: 0,
    shipping: 0,
    total: 7999,
    status: 'Shipped',
    shippingAddress: {
      fullName: 'David Miller',
      street: '120 Ocean View Blvd',
      city: 'Santa Monica',
      state: 'CA',
      postalCode: '90401',
      country: 'USA'
    },
    paymentMethod: 'Cash on Delivery (COD)',
    trackingNumber: 'TRK-99012384'
  },
  {
    id: 'ORD-9019',
    date: '2026-07-25 18:40',
    customerName: 'Emily Watson',
    email: 'emily.w@example.com',
    phone: '+1 555-0377',
    items: [
      { productId: 'p-102', name: 'CuddlePal Plush Giant Teddy Bear', quantity: 1, price: 3499, image: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=200&q=80' }
    ],
    subtotal: 3499,
    discount: 0,
    shipping: 500,
    total: 3999,
    status: 'Delivered',
    shippingAddress: {
      fullName: 'Emily Watson',
      street: '45 Pinewood Dr',
      city: 'Seattle',
      state: 'WA',
      postalCode: '98101',
      country: 'USA'
    },
    paymentMethod: 'Cash on Delivery (COD)',
    trackingNumber: 'TRK-10293847'
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'Sarah Jenkins',
    email: 'sarah.j@example.com',
    phone: '+1 555-0192',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    ordersCount: 3,
    totalSpent: 184.50,
    joinedDate: '2026-01-12',
    addresses: [
      {
        id: 'addr-1',
        name: 'Home',
        street: '742 Evergreen Terrace',
        city: 'Springfield',
        state: 'CA',
        postalCode: '97477',
        isDefault: true
      }
    ]
  },
  {
    id: 'cust-2',
    name: 'David Miller',
    email: 'david.m@example.com',
    phone: '+1 555-0811',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    ordersCount: 2,
    totalSpent: 139.98,
    joinedDate: '2026-03-04',
    addresses: [
      {
        id: 'addr-2',
        name: 'Beach House',
        street: '120 Ocean View Blvd',
        city: 'Santa Monica',
        state: 'CA',
        postalCode: '90401',
        isDefault: true
      }
    ]
  },
  {
    id: 'cust-3',
    name: 'Emily Watson',
    email: 'emily.w@example.com',
    phone: '+1 555-0377',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
    ordersCount: 1,
    totalSpent: 40.98,
    joinedDate: '2026-05-19',
    addresses: [
      {
        id: 'addr-3',
        name: 'Apartment',
        street: '45 Pinewood Dr',
        city: 'Seattle',
        state: 'WA',
        postalCode: '98101',
        isDefault: true
      }
    ]
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'coup-1',
    code: 'PLAYFUL10',
    discountType: 'percentage',
    amount: 10,
    minSpend: 3000,
    expiryDate: '2026-12-31',
    usageLimit: 500,
    usedCount: 84,
    isActive: true
  },
  {
    id: 'coup-2',
    code: 'FUN5',
    discountType: 'flat',
    amount: 5,
    minSpend: 2500,
    expiryDate: '2026-09-30',
    usageLimit: 200,
    usedCount: 42,
    isActive: true
  },
  {
    id: 'coup-3',
    code: 'SUMMERTOYS',
    discountType: 'percentage',
    amount: 15,
    minSpend: 6000,
    expiryDate: '2026-08-31',
    usageLimit: 100,
    usedCount: 29,
    isActive: true
  }
];
