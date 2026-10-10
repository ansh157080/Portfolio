-- ==========================================================
-- Database Schema for Anshu Thakur's Portfolio
-- Thiranex Internship Full-Stack Project
-- ==========================================================

-- 1. Create the database if it doesn't already exist
CREATE DATABASE IF NOT EXISTS portfolio_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE portfolio_db;

-- 2. Projects Table
CREATE TABLE IF NOT EXISTS projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255) DEFAULT '',
  description TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  technologies VARCHAR(255) NOT NULL,
  github_url VARCHAR(255) DEFAULT '#',
  demo_url VARCHAR(255) DEFAULT '#',
  image_url VARCHAR(255) DEFAULT '/assets/suraksha-kawach.svg',
  featured TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Contact Form Submissions Table
CREATE TABLE IF NOT EXISTS contacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL,
  subject VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Initial Seed Data for Projects
-- Clean up existing initial seed rows to prevent duplicate inserts if re-run
DELETE FROM projects WHERE id IN (1, 2, 3);

INSERT INTO projects (id, title, subtitle, description, category, technologies, github_url, demo_url, image_url, featured)
VALUES
(
  1,
  'Suraksha Kawach – AI Powered Fraud Intelligence System',
  'Real-time Financial Fraud Detection & Analytics',
  'An AI/ML-based fraud detection prototype that analyzes transactions, estimates fraud risk, and provides explainable insights.',
  'AI / Machine Learning',
  'Python, Streamlit, XGBoost, SHAP, Pandas',
  '#',
  '#',
  '/assets/suraksha-kawach.svg',
  1
),
(
  2,
  'Mausam – Personalized Weather Experience',
  'Smart Meteorological Advisory & Interactive Forecast',
  'A personalized weather web prototype providing weather information, safety alerts, and useful weather-related insights.',
  'Web Development / SIH',
  'HTML, CSS, JavaScript, Node.js, Express, OpenWeather API',
  '#',
  '#',
  '/assets/mausam.svg',
  1
),
(
  3,
  'Crime Record Management System',
  'Digital Case Tracking & Law Enforcement Records',
  'A centralized digital record management platform enabling law enforcement to log First Information Reports (FIRs), manage criminal profiles, and track investigation case statuses securely.',
  'Full Stack / Database',
  'Java, MySQL, HTML, CSS, JavaScript, Express',
  '#',
  '#',
  '/assets/crime-management.svg',
  1
);
