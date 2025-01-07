-- Insert data into users table
INSERT INTO users (name, email, password)
VALUES 
  ('Alice Johnson', 'alice@example.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
  ('Bob Smith', 'bob@example.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
  ('Charlie Brown', 'charlie@example.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

-- Insert data into properties table
INSERT INTO properties (
  owner_id, title, description, thumbnail_photo_url, cover_photo_url, 
  cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms,
  country, street, city, province, post_code, active
)
VALUES 
  (1, 'Cozy Downtown Apartment', 'A beautiful downtown apartment with all amenities.', 'thumb1.jpg', 'cover1.jpg', 150, 1, 1, 2, 'Canada', '123 Main St', 'Toronto', 'ON', 'M1A2B3', TRUE),
  (2, 'Beachfront Villa', 'Luxury villa with private beach access.', 'thumb2.jpg', 'cover2.jpg', 400, 2, 3, 5, 'USA', '456 Ocean Dr', 'Miami', 'FL', '33101', TRUE),
  (3, 'Mountain Cabin', 'A quiet cabin surrounded by mountains.', 'thumb3.jpg', 'cover3.jpg', 250, 3, 2, 3, 'Canada', '789 Mountain Rd', 'Banff', 'AB', 'T1L1B1', FALSE);

-- Insert data into reservations table
INSERT INTO reservations (start_date, end_date, property_id, guest_id)
VALUES 
  ('2025-02-01', '2025-02-05', 1, 2),
  ('2025-03-10', '2025-03-15', 2, 3),
  ('2025-04-05', '2025-04-12', 3, 1);

-- Insert data into property_reviews table
INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES 
  (2, 1, 1, 5, 'Fantastic stay! Everything was perfect.'),
  (3, 2, 2, 4, 'Beautiful villa, but the Wi-Fi was slow.'),
  (1, 3, 3, 3, 'Nice cabin, but the weather was too cold.');


