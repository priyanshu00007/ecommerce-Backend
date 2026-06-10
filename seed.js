require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool = require('./config/db');

async function seed() {
  const connection = await pool.getConnection();
  try {
    console.log('Seeding database...');

    await connection.query('SET FOREIGN_KEY_CHECKS = 0');
    await connection.query('TRUNCATE TABLE reviews');
    await connection.query('TRUNCATE TABLE payments');
    await connection.query('TRUNCATE TABLE order_items');
    await connection.query('TRUNCATE TABLE orders');
    await connection.query('TRUNCATE TABLE cart');
    await connection.query('TRUNCATE TABLE wishlist');
    await connection.query('TRUNCATE TABLE refresh_tokens');
    await connection.query('DELETE FROM products');
    await connection.query('DELETE FROM categories');
    await connection.query('DELETE FROM users');
    await connection.query('ALTER TABLE users AUTO_INCREMENT = 1');
    await connection.query('ALTER TABLE categories AUTO_INCREMENT = 1');
    await connection.query('ALTER TABLE products AUTO_INCREMENT = 1');
    await connection.query('SET FOREIGN_KEY_CHECKS = 1');

    const adminPassword = await bcrypt.hash('admin123', 10);
    const userPassword = await bcrypt.hash('user123', 10);

    await connection.query(
      `INSERT INTO users (id, name, email, password, role) VALUES
       (1, 'Admin User', 'admin@shop.com', ?, 'admin'),
       (2, 'John Doe', 'john@example.com', ?, 'customer'),
       (3, 'Jane Smith', 'jane@example.com', ?, 'customer')`,
      [adminPassword, userPassword, userPassword]
    );
    console.log('  ✓ Users created (admin@shop.com / admin123)');

    await connection.query(
      `INSERT INTO categories (id, name, description) VALUES
       (1, 'Electronics', 'Phones, laptops, gadgets and accessories'),
       (2, 'Clothing', 'Men and women fashion apparel'),
       (3, 'Home & Kitchen', 'Furniture, decor and kitchen essentials'),
       (4, 'Books', 'Fiction, non-fiction and educational books'),
       (5, 'Sports', 'Sports equipment and fitness gear'),
       (6, 'Beauty', 'Skincare, makeup and personal care')`
    );
    console.log('  ✓ 6 categories created');

    await connection.query(
      `INSERT INTO products (name, description, price, stock, category_id, image_url) VALUES
       ('Wireless Bluetooth Headphones', 'Premium noise-cancelling wireless headphones with 30hr battery life', 2999.00, 50, 1, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'),
       ('Smart Watch Pro', 'Fitness tracker with heart rate monitor, GPS and AMOLED display', 4999.00, 30, 1, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'),
       ('USB-C Hub 7-in-1', 'Multi-port adapter with HDMI, USB 3.0, SD card reader', 1299.00, 100, 1, 'https://images.unsplash.com/photo-1625723044797-44abc8d95e16?w=400'),
       ('Cotton Casual T-Shirt', 'Soft breathable cotton t-shirt available in multiple colors', 599.00, 200, 2, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'),
       ('Denim Jacket', 'Classic blue denim jacket with modern fit', 2499.00, 40, 2, 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=400'),
       ('Running Shoes', 'Lightweight mesh running shoes with cushion sole', 3999.00, 60, 2, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'),
       ('Ceramic Coffee Mug Set', 'Set of 6 handcrafted ceramic mugs with bamboo lids', 899.00, 80, 3, 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400'),
       ('LED Desk Lamp', 'Adjustable touch-control desk lamp with USB charging port', 1499.00, 45, 3, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'),
       ('Non-Stick Cookware Set', '5-piece kitchen pan set with granite coating', 3499.00, 25, 3, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400'),
       ('The Art of Programming', 'Comprehensive guide to mastering software development', 799.00, 120, 4, 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400'),
       ('Mystery Novel Collection', 'Box set of 5 bestselling mystery thrillers', 1499.00, 35, 4, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400'),
       ('Self-Help Bestseller', 'Transform your habits and achieve your goals', 499.00, 90, 4, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400'),
       ('Yoga Mat Premium', 'Eco-friendly thick yoga mat with carrying strap', 1299.00, 70, 5, 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400'),
       ('Dumbbell Set 10kg', 'Adjustable cast iron dumbbells with foam grip', 2499.00, 30, 5, 'https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?w=400'),
       ('Vitamin C Serum', 'Anti-aging face serum with hyaluronic acid and vitamin E', 699.00, 150, 6, 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400'),
       ('Organic Face Cream', 'Natural moisturizing cream for all skin types', 449.00, 100, 6, 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400')`
    );
    console.log('  ✓ 16 products created');

    await connection.query(
      `INSERT INTO orders (id, user_id, total_amount, status, created_at) VALUES
       (1, 2, 5998.00, 'delivered', DATE_SUB(NOW(), INTERVAL 10 DAY)),
       (2, 2, 899.00, 'confirmed', DATE_SUB(NOW(), INTERVAL 3 DAY)),
       (3, 3, 6497.00, 'shipped', DATE_SUB(NOW(), INTERVAL 1 DAY)),
       (4, 3, 1299.00, 'pending', NOW())`
    );
    console.log('  ✓ 4 orders created');

    await connection.query(
      `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
       (1, 1, 1, 2999.00),
       (1, 4, 5, 599.00),
       (2, 7, 1, 899.00),
       (3, 5, 1, 2499.00),
       (3, 6, 1, 3999.00),
       (4, 13, 1, 1299.00)`
    );
    console.log('  ✓ 6 order items created');

    await connection.query(
      `INSERT INTO payments (order_id, amount, method, status) VALUES
       (1, 5998.00, 'card', 'completed'),
       (2, 899.00, 'upi', 'completed'),
       (3, 6497.00, 'upi', 'completed')`
    );
    console.log('  ✓ 3 payments created');

    await connection.query(
      `INSERT INTO reviews (user_id, product_id, rating, comment) VALUES
       (2, 1, 5, 'Amazing sound quality and battery life!'),
       (2, 4, 4, 'Nice fabric, runs slightly large.'),
       (3, 1, 4, 'Great headphones for the price.'),
       (3, 5, 5, 'Perfect fit and looks stylish.')`
    );
    console.log('  ✓ 4 reviews created');

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📧 Admin login: admin@shop.com / admin123');
    console.log('📧 Customer login: john@example.com / user123');
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  } finally {
    connection.release();
    process.exit(0);
  }
}

seed();
