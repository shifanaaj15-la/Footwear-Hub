// FootWear Hub Catalog Database
// Contains exactly 30 unique premium footwear products (10 Men, 10 Women, 10 Kids)
// Converted to Rupees (₹) using a 1 USD = 80 INR scale.

function generateProducts() {
  return [
    // =========================================================================
    // MEN SECTION (10 items)
    // =========================================================================
    {
      id: "m-nike-1",
      name: "Nike Air Max Pulse",
      brand: "Nike",
      category: "men",
      subCategory: "Sneakers",
      price: 10800,
      discount: 10,
      rating: 4.8,
      reviewsCount: 128,
      sizes: [7, 8, 9, 10, 11],
      colors: [
        { name: "Neon Red", hex: "#ff3b30" },
        { name: "Slate Grey", hex: "#5a6b7c" }
      ],
      occasions: ["Casual"],
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop",
      description: "The premium Nike Air Max Pulse is designed for comfort and styling. Features dynamic cushioning and select high-quality materials optimized for everyday men usage. Built with traction outsoles and soft inner liners.",
      trending: true,
      newArrival: true,
      bestSeller: true
    },
    {
      id: "m-adi-1",
      name: "Adidas Ultraboost Light",
      brand: "Adidas",
      category: "men",
      subCategory: "Sports Shoes",
      price: 12800,
      discount: 0,
      rating: 4.9,
      reviewsCount: 245,
      sizes: [8, 9, 10, 11, 12],
      colors: [
        { name: "Slate Grey", hex: "#5a6b7c" },
        { name: "Core Black", hex: "#000000" }
      ],
      occasions: ["Casual", "Sports"],
      image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&auto=format&fit=crop",
      description: "The premium Adidas Ultraboost Light is designed for comfort and styling. Features dynamic cushioning and select high-quality materials optimized for everyday men usage. Built with traction outsoles and soft inner liners.",
      trending: true,
      newArrival: false,
      bestSeller: true
    },
    {
      id: "m-puma-1",
      name: "Puma RS-X Retro",
      brand: "Puma",
      category: "men",
      subCategory: "Sneakers",
      price: 8800,
      discount: 15,
      rating: 4.7,
      reviewsCount: 92,
      sizes: [7, 8, 9, 10, 11],
      colors: [
        { name: "Neon Red", hex: "#ff3b30" },
        { name: "Bright Blue", hex: "#0066cc" }
      ],
      occasions: ["Casual"],
      image: "https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?w=600&auto=format&fit=crop",
      description: "The premium Puma RS-X Retro is designed for comfort and styling. Features dynamic cushioning and select high-quality materials optimized for everyday men usage. Built with traction outsoles and soft inner liners.",
      trending: false,
      newArrival: true,
      bestSeller: false
    },
    {
      id: "m-bata-1",
      name: "Bata Classic Leather Loafer",
      brand: "Bata",
      category: "men",
      subCategory: "Loafers",
      price: 4400,
      discount: 0,
      rating: 4.5,
      reviewsCount: 64,
      sizes: [7, 8, 9, 10],
      colors: [
        { name: "Chestnut Brown", hex: "#5c4033" },
        { name: "Tan", hex: "#b87333" }
      ],
      occasions: ["Casual", "Formal"],
      image: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=600&auto=format&fit=crop",
      description: "The premium Bata Classic Leather Loafer is designed for comfort and styling. Features dynamic cushioning and select high-quality materials optimized for everyday men usage. Built with traction outsoles and soft inner liners.",
      trending: true,
      newArrival: false,
      bestSeller: false
    },
    {
      id: "m-wood-1",
      name: "Woodland All-Weather Leather Boots",
      brand: "Woodland",
      category: "men",
      subCategory: "Formal Shoes",
      price: 10000,
      discount: 20,
      rating: 4.6,
      reviewsCount: 118,
      sizes: [7, 8, 9, 10, 11, 12],
      colors: [
        { name: "Chestnut Brown", hex: "#5c4033" },
        { name: "Slate Grey", hex: "#5a6b7c" }
      ],
      occasions: ["Casual", "Formal"],
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&auto=format&fit=crop",
      description: "The premium Woodland All-Weather Leather Boots is designed for comfort and styling. Features dynamic cushioning and select high-quality materials optimized for everyday men usage. Built with traction outsoles and soft inner liners.",
      trending: false,
      newArrival: true,
      bestSeller: true
    },
    {
      id: "m-ske-1",
      name: "Skechers Arch Fit Walker",
      brand: "Skechers",
      category: "men",
      subCategory: "Sports Shoes",
      price: 6800,
      discount: 10,
      rating: 4.8,
      reviewsCount: 156,
      sizes: [8, 9, 10, 11],
      colors: [
        { name: "Slate Grey", hex: "#5a6b7c" },
        { name: "Core Black", hex: "#000000" }
      ],
      occasions: ["Casual", "Sports"],
      image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&auto=format&fit=crop",
      description: "The premium Skechers Arch Fit Walker is designed for comfort and styling. Features dynamic cushioning and select high-quality materials optimized for everyday men usage. Built with traction outsoles and soft inner liners.",
      trending: true,
      newArrival: true,
      bestSeller: false
    },
    {
      id: "m-croc-1",
      name: "Crocs Classic Unisex Clog",
      brand: "Crocs",
      category: "men",
      subCategory: "Sliders",
      price: 3600,
      discount: 0,
      rating: 4.4,
      reviewsCount: 312,
      sizes: [6, 7, 8, 9, 10, 11],
      colors: [
        { name: "Bright Blue", hex: "#0066cc" },
        { name: "Volt Green", hex: "#adff2f" }
      ],
      occasions: ["Casual", "Slippers"],
      image: "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=600&auto=format&fit=crop",
      description: "The premium Crocs Classic Unisex Clog is designed for comfort and styling. Features dynamic cushioning and select high-quality materials optimized for everyday men usage. Built with traction outsoles and soft inner liners.",
      trending: false,
      newArrival: false,
      bestSeller: true
    },
    {
      id: "m-nike-2",
      name: "Nike Court Legacy",
      brand: "Nike",
      category: "men",
      subCategory: "Sneakers",
      price: 7600,
      discount: 10,
      rating: 4.6,
      reviewsCount: 88,
      sizes: [7, 8, 9, 10, 11],
      colors: [
        { name: "Core Black", hex: "#000000" },
        { name: "Slate Grey", hex: "#5a6b7c" }
      ],
      occasions: ["Casual"],
      image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=600&auto=format&fit=crop",
      description: "The premium Nike Court Legacy is designed for comfort and styling. Features dynamic cushioning and select high-quality materials optimized for everyday men usage. Built with traction outsoles and soft inner liners.",
      trending: true,
      newArrival: false,
      bestSeller: false
    },
    {
      id: "m-adi-2",
      name: "Adidas Superstar Classic",
      brand: "Adidas",
      category: "men",
      subCategory: "Sneakers",
      price: 8400,
      discount: 15,
      rating: 4.9,
      reviewsCount: 420,
      sizes: [7, 8, 9, 10, 11, 12],
      colors: [
        { name: "Core Black", hex: "#000000" },
        { name: "Slate Grey", hex: "#5a6b7c" }
      ],
      occasions: ["Casual"],
      image: "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=600&auto=format&fit=crop",
      description: "The premium Adidas Superstar Classic is designed for comfort and styling. Features dynamic cushioning and select high-quality materials optimized for everyday men usage. Built with traction outsoles and soft inner liners.",
      trending: true,
      newArrival: true,
      bestSeller: true
    },
    {
      id: "m-wood-2",
      name: "Woodland Explorer Suede Sandals",
      brand: "Woodland",
      category: "men",
      subCategory: "Sandals",
      price: 6000,
      discount: 0,
      rating: 4.5,
      reviewsCount: 76,
      sizes: [7, 8, 9, 10, 11],
      colors: [
        { name: "Tan", hex: "#b87333" },
        { name: "Chestnut Brown", hex: "#5c4033" }
      ],
      occasions: ["Casual", "Sandals"],
      image: "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=600&auto=format&fit=crop",
      description: "The premium Woodland Explorer Suede Sandals is designed for comfort and styling. Features dynamic cushioning and select high-quality materials optimized for everyday men usage. Built with traction outsoles and soft inner liners.",
      trending: false,
      newArrival: false,
      bestSeller: false
    },

    // =========================================================================
    // WOMEN SECTION (10 items)
    // =========================================================================
    {
      id: "w-nike-1",
      name: "Nike Bella Block Heels",
      brand: "Nike",
      category: "women",
      subCategory: "Heels",
      price: 11200,
      discount: 10,
      rating: 4.8,
      reviewsCount: 94,
      sizes: [5, 6, 7, 8, 9],
      colors: [
        { name: "Elegant Gold", hex: "#ffd700" },
        { name: "Tan", hex: "#b87333" }
      ],
      occasions: ["Casual", "Party Wear"],
      image: "images/heels_yellow.jpg",
      description: "The premium Nike Bella Block Heels is designed for comfort and styling. Features dynamic cushioning and select high-quality materials optimized for everyday women usage. Built with traction outsoles and soft inner liners.",
      trending: true,
      newArrival: true,
      bestSeller: true
    },
    {
      id: "w-adi-1",
      name: "Adidas Original Ankle Sandals",
      brand: "Adidas",
      category: "women",
      subCategory: "Sandals",
      price: 5200,
      discount: 0,
      rating: 4.5,
      reviewsCount: 110,
      sizes: [5, 6, 7, 8, 9],
      colors: [
        { name: "Slate Grey", hex: "#5a6b7c" },
        { name: "Core Black", hex: "#000000" }
      ],
      occasions: ["Casual", "Slippers"],
      image: "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=600&auto=format&fit=crop",
      description: "The premium Adidas Original Ankle Sandals is designed for comfort and styling. Features dynamic cushioning and select high-quality materials optimized for everyday women usage. Built with traction outsoles and soft inner liners.",
      trending: false,
      newArrival: false,
      bestSeller: true
    },
    {
      id: "w-puma-1",
      name: "Puma Cali Dream Wedges",
      brand: "Puma",
      category: "women",
      subCategory: "Heels",
      price: 9200,
      discount: 15,
      rating: 4.7,
      reviewsCount: 82,
      sizes: [5, 6, 7, 8, 9],
      colors: [
        { name: "Core Black", hex: "#000000" },
        { name: "Slate Grey", hex: "#5a6b7c" }
      ],
      occasions: ["Casual", "Party Wear"],
      image: "images/heels_black.jpg",
      description: "The premium Puma Cali Dream Wedges is designed for comfort and styling. Features dynamic cushioning and select high-quality materials optimized for everyday women usage. Built with traction outsoles and soft inner liners.",
      trending: true,
      newArrival: false,
      bestSeller: false
    },
    {
      id: "w-bata-1",
      name: "Bata Pointed Toe Flats",
      brand: "Bata",
      category: "women",
      subCategory: "Flats",
      price: 3600,
      discount: 0,
      rating: 4.4,
      reviewsCount: 58,
      sizes: [5, 6, 7, 8],
      colors: [
        { name: "Bright Blue", hex: "#0066cc" },
        { name: "Rose Blush", hex: "#e0b0ff" }
      ],
      occasions: ["Casual"],
      image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&auto=format&fit=crop",
      description: "The premium Bata Pointed Toe Flats is designed for comfort and styling. Features dynamic cushioning and select high-quality materials optimized for everyday women usage. Built with traction outsoles and soft inner liners.",
      trending: false,
      newArrival: true,
      bestSeller: false
    },
    {
      id: "w-wood-1",
      name: "Woodland Trail Active Sandals",
      brand: "Woodland",
      category: "women",
      subCategory: "Sandals",
      price: 6400,
      discount: 10,
      rating: 4.6,
      reviewsCount: 73,
      sizes: [5, 6, 7, 8, 9],
      colors: [
        { name: "Tan", hex: "#b87333" },
        { name: "Chestnut Brown", hex: "#5c4033" }
      ],
      occasions: ["Casual", "Sandals"],
      image: "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=600&auto=format&fit=crop",
      description: "The premium Woodland Trail Active Sandals is designed for comfort and styling. Features dynamic cushioning and select high-quality materials optimized for everyday women usage. Built with traction outsoles and soft inner liners.",
      trending: true,
      newArrival: false,
      bestSeller: true
    },
    {
      id: "w-ske-1",
      name: "Skechers Cleo Ballet Flats",
      brand: "Skechers",
      category: "women",
      subCategory: "Flats",
      price: 5600,
      discount: 15,
      rating: 4.7,
      reviewsCount: 142,
      sizes: [5, 6, 7, 8, 9],
      colors: [
        { name: "Slate Grey", hex: "#5a6b7c" },
        { name: "Core Black", hex: "#000000" }
      ],
      occasions: ["Casual"],
      image: "https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=600&auto=format&fit=crop",
      description: "The premium Skechers Cleo Ballet Flats is designed for comfort and styling. Features dynamic cushioning and select high-quality materials optimized for everyday women usage. Built with traction outsoles and soft inner liners.",
      trending: true,
      newArrival: true,
      bestSeller: false
    },
    {
      id: "w-croc-1",
      name: "Crocs Brooklyn Wedge Heel",
      brand: "Crocs",
      category: "women",
      subCategory: "Heels",
      price: 6800,
      discount: 0,
      rating: 4.6,
      reviewsCount: 198,
      sizes: [5, 6, 7, 8, 9],
      colors: [
        { name: "Bright Blue", hex: "#0066cc" },
        { name: "Slate Grey", hex: "#5a6b7c" }
      ],
      occasions: ["Casual", "Party Wear"],
      image: "images/heels_blue.jpg",
      description: "The premium Crocs Brooklyn Wedge Heel is designed for comfort and styling. Features dynamic cushioning and select high-quality materials optimized for everyday women usage. Built with traction outsoles and soft inner liners.",
      trending: false,
      newArrival: false,
      bestSeller: true
    },
    {
      id: "w-nike-2",
      name: "Nike Court Slide Sandals",
      brand: "Nike",
      category: "women",
      subCategory: "Sandals",
      price: 4800,
      discount: 10,
      rating: 4.5,
      reviewsCount: 67,
      sizes: [5, 6, 7, 8, 9],
      colors: [
        { name: "Core Black", hex: "#000000" },
        { name: "Rose Blush", hex: "#e0b0ff" }
      ],
      occasions: ["Casual", "Sandals"],
      image: "images/skechers_sandal.png",
      description: "The premium Nike Court Slide Sandals is designed for comfort and styling. Features dynamic cushioning and select high-quality materials optimized for everyday women usage. Built with traction outsoles and soft inner liners.",
      trending: true,
      newArrival: false,
      bestSeller: false
    },
    {
      id: "w-adi-2",
      name: "Adidas Stan Bow Ballerinas",
      brand: "Adidas",
      category: "women",
      subCategory: "Flats",
      price: 7200,
      discount: 20,
      rating: 4.8,
      reviewsCount: 104,
      sizes: [5, 6, 7, 8, 9],
      colors: [
        { name: "Rose Blush", hex: "#e0b0ff" },
        { name: "Slate Grey", hex: "#5a6b7c" }
      ],
      occasions: ["Casual"],
      image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=600&auto=format&fit=crop",
      description: "The premium Adidas Stan Bow Ballerinas is designed for comfort and styling. Features dynamic cushioning and select high-quality materials optimized for everyday women usage. Built with traction outsoles and soft inner liners.",
      trending: true,
      newArrival: true,
      bestSeller: true
    },
    {
      id: "w-wood-2",
      name: "Woodland Camel Suede Flats",
      brand: "Woodland",
      category: "women",
      subCategory: "Flats",
      price: 6000,
      discount: 0,
      rating: 4.4,
      reviewsCount: 52,
      sizes: [5, 6, 7, 8, 9],
      colors: [
        { name: "Chestnut Brown", hex: "#5c4033" },
        { name: "Tan", hex: "#b87333" }
      ],
      occasions: ["Casual"],
      image: "https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?w=600&auto=format&fit=crop",
      description: "The premium Woodland Camel Suede Flats is designed for comfort and styling. Features dynamic cushioning and select high-quality materials optimized for everyday women usage. Built with traction outsoles and soft inner liners.",
      trending: false,
      newArrival: false,
      bestSeller: false
    },

    // =========================================================================
    // KIDS SECTION (10 items)
    // =========================================================================
    {
      id: "k-nike-1",
      name: "Nike Air Max Junior",
      brand: "Nike",
      category: "kids",
      subCategory: "Sports Shoes",
      price: 5200,
      discount: 10,
      rating: 4.8,
      reviewsCount: 75,
      sizes: [1, 2, 3, 4, 5],
      colors: [
        { name: "Bright Blue", hex: "#0066cc" },
        { name: "Volt Green", hex: "#adff2f" }
      ],
      occasions: ["Casual", "Sports"],
      image: "images/kids_nike_blue.png",
      description: "The premium Nike Air Max Junior is designed for comfort and styling. Features dynamic cushioning and select high-quality materials optimized for everyday kids usage. Built with traction outsoles and soft inner liners.",
      trending: true,
      newArrival: true,
      bestSeller: true
    },
    {
      id: "k-adi-1",
      name: "Adidas Tensaur Velcro Sport",
      brand: "Adidas",
      category: "kids",
      subCategory: "Sports Shoes",
      price: 4000,
      discount: 0,
      rating: 4.7,
      reviewsCount: 120,
      sizes: [1, 2, 3, 4, 5, 6],
      colors: [
        { name: "Core Black", hex: "#000000" },
        { name: "Slate Grey", hex: "#5a6b7c" }
      ],
      occasions: ["Casual", "Sports"],
      image: "images/kids_adidas_black.png",
      description: "The premium Adidas Tensaur Velcro Sport is designed for comfort and styling. Features dynamic cushioning and select high-quality materials optimized for everyday kids usage. Built with traction outsoles and soft inner liners.",
      trending: true,
      newArrival: false,
      bestSeller: true
    },
    {
      id: "k-puma-1",
      name: "Puma RS-Fast Junior",
      brand: "Puma",
      category: "kids",
      subCategory: "Sports Shoes",
      price: 4400,
      discount: 15,
      rating: 4.6,
      reviewsCount: 62,
      sizes: [1, 2, 3, 4, 5],
      colors: [
        { name: "Pink Accent", hex: "#ff69b4" },
        { name: "Rose Blush", hex: "#e0b0ff" }
      ],
      occasions: ["Casual", "Sports"],
      image: "images/kids_puma_pink.png",
      description: "The premium Puma RS-Fast Junior is designed for comfort and styling. Features dynamic cushioning and select high-quality materials optimized for everyday kids usage. Built with traction outsoles and soft inner liners.",
      trending: false,
      newArrival: true,
      bestSeller: false
    },
    {
      id: "k-bata-1",
      name: "Bata Smart Uniform School Shoes",
      brand: "Bata",
      category: "kids",
      subCategory: "School Shoes",
      price: 2800,
      discount: 0,
      rating: 4.5,
      reviewsCount: 180,
      sizes: [1, 2, 3, 4, 5, 6],
      colors: [
        { name: "Core Black", hex: "#000000" },
        { name: "Slate Grey", hex: "#5a6b7c" }
      ],
      occasions: ["Casual", "School"],
      image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600&auto=format&fit=crop",
      description: "The premium Bata Smart Uniform School Shoes is designed for comfort and styling. Features dynamic cushioning and select high-quality materials optimized for everyday kids usage. Built with traction outsoles and soft inner liners.",
      trending: true,
      newArrival: false,
      bestSeller: true
    },
    {
      id: "k-wood-1",
      name: "Woodland Junior Trail Boots",
      brand: "Woodland",
      category: "kids",
      subCategory: "Slippers",
      price: 5600,
      discount: 10,
      rating: 4.8,
      reviewsCount: 43,
      sizes: [2, 3, 4, 5],
      colors: [
        { name: "Chestnut Brown", hex: "#5c4033" },
        { name: "Tan", hex: "#b87333" }
      ],
      occasions: ["Casual", "Slippers"],
      image: "images/kids_hightop.png",
      description: "The premium Woodland Junior Trail Boots is designed for comfort and styling. Features dynamic cushioning and select high-quality materials optimized for everyday kids usage. Built with traction outsoles and soft inner liners.",
      trending: true,
      newArrival: true,
      bestSeller: false
    },
    {
      id: "k-ske-1",
      name: "Skechers Mega-Craft Pixel",
      brand: "Skechers",
      category: "kids",
      subCategory: "Casual Shoes",
      price: 4800,
      discount: 20,
      rating: 4.7,
      reviewsCount: 98,
      sizes: [1, 2, 3, 4, 5],
      colors: [
        { name: "Volt Green", hex: "#adff2f" },
        { name: "Bright Blue", hex: "#0066cc" }
      ],
      occasions: ["Casual"],
      image: "images/kids_nike_black.png",
      description: "The premium Skechers Mega-Craft Pixel is designed for comfort and styling. Features dynamic cushioning and select high-quality materials optimized for everyday kids usage. Built with traction outsoles and soft inner liners.",
      trending: false,
      newArrival: true,
      bestSeller: false
    },
    {
      id: "k-croc-1",
      name: "Crocs Classic Kids Clog",
      brand: "Crocs",
      category: "kids",
      subCategory: "Slippers",
      price: 3200,
      discount: 0,
      rating: 4.9,
      reviewsCount: 350,
      sizes: [1, 2, 3, 4, 5, 6],
      colors: [
        { name: "Bright Blue", hex: "#0066cc" },
        { name: "Volt Green", hex: "#adff2f" }
      ],
      occasions: ["Casual", "Slippers"],
      image: "images/kids_navy.png",
      description: "The premium Crocs Classic Kids Clog is designed for comfort and styling. Features dynamic cushioning and select high-quality materials optimized for everyday kids usage. Built with traction outsoles and soft inner liners.",
      trending: true,
      newArrival: false,
      bestSeller: true
    },
    {
      id: "k-nike-2",
      name: "Nike Force 1 Low Kid",
      brand: "Nike",
      category: "kids",
      subCategory: "Casual Shoes",
      price: 4400,
      discount: 10,
      rating: 4.8,
      reviewsCount: 88,
      sizes: [1, 2, 3, 4, 5],
      colors: [
        { name: "Bright Blue", hex: "#0066cc" },
        { name: "Volt Green", hex: "#adff2f" }
      ],
      occasions: ["Casual"],
      image: "images/kids_blue_yellow.png",
      description: "The premium Nike Force 1 Low Kid is designed for comfort and styling. Features dynamic cushioning and select high-quality materials optimized for everyday kids usage. Built with traction outsoles and soft inner liners.",
      trending: true,
      newArrival: false,
      bestSeller: false
    },
    {
      id: "k-adi-2",
      name: "Adidas Superstar Elastic Kids",
      brand: "Adidas",
      category: "kids",
      subCategory: "Casual Shoes",
      price: 4800,
      discount: 15,
      rating: 4.7,
      reviewsCount: 112,
      sizes: [1, 2, 3, 4, 5, 6],
      colors: [
        { name: "Core Black", hex: "#000000" },
        { name: "Slate Grey", hex: "#5a6b7c" }
      ],
      occasions: ["Casual"],
      image: "images/kids_canvas_black.png",
      description: "The premium Adidas Superstar Elastic Kids is designed for comfort and styling. Features dynamic cushioning and select high-quality materials optimized for everyday kids usage. Built with traction outsoles and soft inner liners.",
      trending: false,
      newArrival: true,
      bestSeller: true
    },
    {
      id: "k-puma-2",
      name: "Puma Carina Velcro Kid",
      brand: "Puma",
      category: "kids",
      subCategory: "Casual Shoes",
      price: 3840,
      discount: 0,
      rating: 4.5,
      reviewsCount: 56,
      sizes: [1, 2, 3, 4, 5],
      colors: [
        { name: "Pink Accent", hex: "#ff69b4" },
        { name: "Rose Blush", hex: "#e0b0ff" }
      ],
      occasions: ["Casual"],
      image: "images/kids_pink.png",
      description: "The premium Puma Carina Velcro Kid is designed for comfort and styling. Features dynamic cushioning and select high-quality materials optimized for everyday kids usage. Built with traction outsoles and soft inner liners.",
      trending: false,
      newArrival: false,
      bestSeller: false
    }
  ];
}

const PRODUCTS = generateProducts();
