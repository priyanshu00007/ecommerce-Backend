const formatPrice = (num) => new Intl.NumberFormat('en-US').format(num);

export const mockProducts = [
  { id: 1, name: 'Wireless Bluetooth Headphones', description: 'Premium noise-cancelling wireless headphones with 30hr battery life', price: 2999, stock: 50, category_id: 1, category_name: 'Electronics', image_url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8V2lyZWxlc3MlMjBCbHVldG9vdGglMjBIZWFkcGhvbmVzfGVufDB8fDB8fHww', created_at: '2026-06-01' },
  { id: 2, name: 'Smart Watch Pro', description: 'Fitness tracker with heart rate monitor, GPS and AMOLED display', price: 4999, stock: 30, category_id: 1, category_name: 'Electronics', image_url: 'https://images.unsplash.com/photo-1696688713460-de12ac76ebc6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8U21hcnQlMjBXYXRjaCUyMFByb3xlbnwwfHwwfHx8MA%3D%3D', created_at: '2026-06-02' },
  { id: 3, name: 'USB-C Hub 7-in-1', description: 'Multi-port adapter with HDMI, USB 3.0, SD card reader', price: 1299, stock: 100, category_id: 1, category_name: 'Electronics', image_url: 'https://plus.unsplash.com/premium_photo-1764113096548-11270b5febed?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8VVNCLUMlMjBIdWIlMjA3LWluLTF8ZW58MHx8MHx8fDA%3D', created_at: '2026-06-03' },
  { id: 4, name: 'Cotton Casual T-Shirt', description: 'Soft breathable cotton t-shirt available in multiple colors', price: 599, stock: 200, category_id: 2, category_name: 'Clothing', image_url: 'https://plus.unsplash.com/premium_photo-1689629728966-0d248b5aeda2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Q290dG9uJTIwQ2FzdWFsJTIwVC1TaGlyfGVufDB8fDB8fHww', created_at: '2026-06-04' },
  { id: 5, name: 'Denim Jacket', description: 'Classic blue denim jacket with modern fit', price: 2499, stock: 40, category_id: 2, category_name: 'Clothing', image_url: 'https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZGVuaW0lMjBqYWNrZXR8ZW58MHx8MHx8fDA%3D', created_at: '2026-06-05' },
  { id: 6, name: 'Running Shoes', description: 'Lightweight mesh running shoes with cushion sole', price: 3999, stock: 60, category_id: 2, category_name: 'Clothing', image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cnVubmluZyUyMHNob2VzfGVufDB8fDB8fHww', created_at: '2026-06-06' },
  { id: 7, name: 'Ceramic Coffee Mug Set', description: 'Set of 6 handcrafted ceramic mugs with bamboo lids', price: 899, stock: 80, category_id: 3, category_name: 'Home & Kitchen', image_url: 'https://images.unsplash.com/photo-1542556398-95fb5b9f9b48?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Q2VyYW1pYyUyMENvZmZlZSUyME11ZyUyMFNldHxlbnwwfHwwfHx8MA%3D%3D', created_at: '2026-06-07' },
  { id: 8, name: 'LED Desk Lamp', description: 'Adjustable touch-control desk lamp with USB charging port', price: 1499, stock: 45, category_id: 3, category_name: 'Home & Kitchen', image_url: 'https://images.unsplash.com/photo-1570974802254-4b0ad1a755f5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8J0xFRCUyMERlc2slMjBMYW1wfGVufDB8fDB8fHww', created_at: '2026-06-08' },
  { id: 9, name: 'Non-Stick Cookware Set', description: '5-piece kitchen pan set with granite coating', price: 3499, stock: 25, category_id: 3, category_name: 'Home & Kitchen', image_url: 'https://images.unsplash.com/photo-1584990347193-6bebebfeaeee?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Tm9uLVN0aWNrJTIwQ29va3dhcmUlMjBTZXR8ZW58MHx8MHx8fDA%3D', created_at: '2026-06-09' },
  { id: 10, name: 'The Art of Programming', description: 'Comprehensive guide to mastering software development', price: 799, stock: 120, category_id: 4, category_name: 'Books', image_url: '/images/product.svg', created_at: '2026-06-10' },
  { id: 11, name: 'Mystery Novel Collection', description: 'Box set of 5 bestselling mystery thrillers', price: 1499, stock: 35, category_id: 4, category_name: 'Books', image_url: '/images/product.svg', created_at: '2026-06-11' },
  { id: 12, name: 'Self-Help Bestseller', description: 'Transform your habits and achieve your goals', price: 499, stock: 90, category_id: 4, category_name: 'Books', image_url: '/images/product.svg', created_at: '2026-06-12' },
  { id: 13, name: 'Yoga Mat Premium', description: 'Eco-friendly thick yoga mat with carrying strap', price: 1299, stock: 70, category_id: 5, category_name: 'Sports', image_url: '/images/product.svg', created_at: '2026-06-13' },
  { id: 14, name: 'Dumbbell Set 10kg', description: 'Adjustable cast iron dumbbells with foam grip', price: 2499, stock: 30, category_id: 5, category_name: 'Sports', image_url: '/images/product.svg', created_at: '2026-06-14' },
  { id: 15, name: 'Vitamin C Serum', description: 'Anti-aging face serum with hyaluronic acid and vitamin E', price: 699, stock: 150, category_id: 6, category_name: 'Beauty', image_url: '/images/product.svg', created_at: '2026-06-15' },
  { id: 16, name: 'Organic Face Cream', description: 'Natural moisturizing cream for all skin types', price: 449, stock: 100, category_id: 6, category_name: 'Beauty', image_url: 'https://images.unsplash.com/photo-1695972235639-7af9a9a6d2d5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZmFjZSUyMGNycmVhbXxlbnwwfHwwfHx8MA%3D%3D', created_at: '2026-06-16' },
];

export const mockCategories = [
  { id: 1, name: 'Electronics', description: 'Phones, laptops, gadgets and accessories', product_count: 3, created_at: '2026-06-01' },
  { id: 2, name: 'Clothing', description: 'Men and women fashion apparel', product_count: 3, created_at: '2026-06-01' },
  { id: 3, name: 'Home & Kitchen', description: 'Furniture, decor and kitchen essentials', product_count: 3, created_at: '2026-06-01' },
  { id: 4, name: 'Books', description: 'Fiction, non-fiction and educational books', product_count: 3, created_at: '2026-06-01' },
  { id: 5, name: 'Sports', description: 'Sports equipment and fitness gear', product_count: 2, created_at: '2026-06-01' },
  { id: 6, name: 'Beauty', description: 'Skincare, makeup and personal care', product_count: 2, created_at: '2026-06-01' },
];

export const mockUsers = [
  { id: 1, name: 'Admin User', email: 'admin@shop.com', password: 'admin123', role: 'admin', created_at: '2026-06-01' },
  { id: 2, name: 'John Doe', email: 'john@example.com', password: 'user123', role: 'customer', created_at: '2026-06-01' },
  { id: 3, name: 'Jane Smith', email: 'jane@example.com', password: 'user123', role: 'customer', created_at: '2026-06-01' },
];

export const mockReviews = [
  { id: 1, user_id: 2, product_id: 1, rating: 5, comment: 'Amazing sound quality and battery life!', user_name: 'John Doe', created_at: '2026-06-05' },
  { id: 2, user_id: 2, product_id: 4, rating: 4, comment: 'Nice fabric, runs slightly large.', user_name: 'John Doe', created_at: '2026-06-06' },
  { id: 3, user_id: 3, product_id: 1, rating: 4, comment: 'Great headphones for the price.', user_name: 'Jane Smith', created_at: '2026-06-07' },
  { id: 4, user_id: 3, product_id: 5, rating: 5, comment: 'Perfect fit and looks stylish.', user_name: 'Jane Smith', created_at: '2026-06-08' },
];

export const mockOrders = [
  { id: 1, user_id: 2, total_amount: 5998, status: 'delivered', created_at: '2026-05-30', items: [
    { id: 1, product_id: 1, product_name: 'Wireless Bluetooth Headphones', product_image: '/images/product.svg', quantity: 1, price: 2999 },
    { id: 2, product_id: 4, product_name: 'Cotton Casual T-Shirt', product_image: '/images/product.svg', quantity: 5, price: 599 },
  ]},
  { id: 2, user_id: 2, total_amount: 899, status: 'confirmed', created_at: '2026-06-06', items: [
    { id: 3, product_id: 7, product_name: 'Ceramic Coffee Mug Set', product_image: '/images/product.svg', quantity: 1, price: 899 },
  ]},
];

export function filterMockProducts(params = {}) {
  let result = [...mockProducts];
  if (params.category) result = result.filter(p => p.category_id === Number(params.category));
  if (params.min_price) result = result.filter(p => p.price >= Number(params.min_price));
  if (params.max_price) result = result.filter(p => p.price <= Number(params.max_price));
  if (params.search) result = result.filter(p => p.name.toLowerCase().includes(params.search.toLowerCase()));
  if (params.sort === 'price_asc') result.sort((a, b) => a.price - b.price);
  else if (params.sort === 'price_desc') result.sort((a, b) => b.price - a.price);
  else if (params.sort === 'name') result.sort((a, b) => a.name.localeCompare(b.name));
  else result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const page = Number(params.page) || 1;
  const limit = Math.min(Number(params.limit) || 20, 100);
  const total = result.length;
  const pages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const products = result.slice(start, start + limit);

  return { products, pagination: { page, limit, total, pages } };
}
