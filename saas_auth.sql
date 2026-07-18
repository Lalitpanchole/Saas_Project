-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 17, 2026 at 01:23 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `saas_auth`
--

-- --------------------------------------------------------

--
-- Table structure for table `activity_logs`
--

CREATE TABLE `activity_logs` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `action` varchar(100) NOT NULL,
  `module` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` varchar(255) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `activity_logs`
--

INSERT INTO `activity_logs` (`id`, `user_id`, `action`, `module`, `description`, `ip_address`, `user_agent`, `created_at`) VALUES
(1, 1, 'LOGIN', 'auth', 'User admin@example.com logged in.', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-07-17 06:26:08.489'),
(2, 1, 'LOGIN', 'auth', 'User admin@example.com logged in.', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-07-17 06:28:59.170'),
(3, 1, 'USER_CREATE', 'users', 'Created user account for neha@gmail.com.', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-07-17 06:30:48.526'),
(4, 1, 'LOGIN', 'auth', 'User admin@example.com logged in.', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-07-17 06:37:52.754'),
(5, 1, 'LOGIN', 'auth', 'User admin@example.com logged in.', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-07-17 06:41:10.819'),
(6, 2, 'LOGIN', 'auth', 'User neha@gmail.com logged in.', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-07-17 06:44:41.027'),
(7, 1, 'LOGIN', 'auth', 'User admin@example.com logged in.', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-07-17 06:45:12.243'),
(8, 1, 'USER_PERMISSIONS_UPDATE', 'users', 'Updated permission overrides for user neha@gmail.com.', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-07-17 06:45:55.360'),
(9, 2, 'LOGIN', 'auth', 'User neha@gmail.com logged in.', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-07-17 06:46:13.125'),
(10, 1, 'LOGIN', 'auth', 'User admin@example.com logged in.', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-07-17 06:46:55.938'),
(11, 1, 'THEME_UPDATE', 'settings', 'Updated application theme & settings (RBAC Starter).', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-07-17 06:48:08.413'),
(12, 1, 'THEME_UPDATE', 'settings', 'Updated application theme & settings (RBAC Starter).', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-07-17 06:48:17.045'),
(13, 1, 'THEME_UPDATE', 'settings', 'Updated application theme & settings (RBAC Starter).', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-07-17 06:48:21.669'),
(14, 1, 'THEME_UPDATE', 'settings', 'Updated application theme & settings (RBAC Starter).', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-07-17 06:48:26.542'),
(15, 1, 'THEME_UPDATE', 'settings', 'Updated application theme & settings (RBAC Starter).', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-07-17 06:48:30.868'),
(16, 1, 'THEME_UPDATE', 'settings', 'Updated application theme & settings (RBAC Starter).', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-07-17 06:48:42.195'),
(17, 1, 'ROLE_CREATE', 'roles', 'Created new custom role \"client\" (client).', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-07-17 06:50:27.861'),
(18, 1, 'MENU_UPDATE', 'menus', 'Updated menu item \"Users\".', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-07-17 06:50:43.344'),
(19, 1, 'MENU_UPDATE', 'menus', 'Updated menu item \"Users\".', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-07-17 06:50:45.504'),
(20, 1, 'MENU_UPDATE', 'menus', 'Updated menu item \"Users\".', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-07-17 06:50:51.252'),
(21, 1, 'MENU_UPDATE', 'menus', 'Updated menu item \"Users\".', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-07-17 06:50:53.702'),
(22, 1, 'MENU_UPDATE', 'menus', 'Updated menu item \"Roles\".', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-07-17 06:50:59.979'),
(23, 1, 'MENU_UPDATE', 'menus', 'Updated menu item \"Roles\".', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-07-17 06:51:00.970'),
(24, 1, 'MENU_UPDATE', 'menus', 'Updated menu item \"Menus\".', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-07-17 06:51:02.057'),
(25, 1, 'MENU_UPDATE', 'menus', 'Updated menu item \"Menus\".', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-07-17 06:51:02.504'),
(26, 1, 'PERMISSION_MATRIX_UPDATE', 'permissions', 'Updated global permission matrix across multiple roles.', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-07-17 06:52:34.235'),
(27, 1, 'PERMISSION_MATRIX_UPDATE', 'permissions', 'Updated global permission matrix across multiple roles.', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-07-17 06:52:37.839'),
(28, 1, 'USER_CREATE', 'users', 'Created user account for user@gmail.com.', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-07-17 07:27:05.315'),
(29, 1, 'LOGIN', 'auth', 'User admin@example.com logged in.', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-07-17 07:40:38.597'),
(30, 1, 'THEME_UPDATE', 'settings', 'Updated application theme & settings (RBAC Kiaan Starter).', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-07-17 07:41:00.912'),
(31, 1, 'THEME_UPDATE', 'settings', 'Updated application theme & settings (RBAC Kiaan Starter).', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-07-17 07:41:52.897'),
(32, 1, 'THEME_UPDATE', 'settings', 'Updated application theme & settings (RBAC Kiaan Starter).', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-07-17 07:42:45.576'),
(33, 1, 'THEME_UPDATE', 'settings', 'Updated application theme & settings (RBAC Kiaan Starter).', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-07-17 07:43:49.561'),
(34, 1, 'THEME_UPDATE', 'settings', 'Updated application theme & settings (RBAC Kiaan Starter).', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-07-17 07:46:46.120'),
(35, 1, 'THEME_UPDATE', 'settings', 'Updated application theme & settings (RBAC Kiaan Starter).', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-07-17 07:47:01.152'),
(36, 1, 'THEME_UPDATE', 'settings', 'Updated application theme & settings (RBAC Kiaan Starter).', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-07-17 07:47:13.620'),
(37, 1, 'THEME_UPDATE', 'settings', 'Updated application theme & settings (RBAC Kiaan Starter).', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-07-17 07:48:20.497'),
(38, 1, 'THEME_UPDATE', 'settings', 'Updated application theme & settings (RBAC Kiaan Starter).', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-07-17 07:48:33.983'),
(39, 1, 'THEME_UPDATE', 'settings', 'Updated application theme & settings (RBAC Kiaan Starter).', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-07-17 07:49:07.601'),
(40, 1, 'THEME_UPDATE', 'settings', 'Updated application theme & settings (RBAC Kiaan Starter).', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-07-17 07:49:19.840'),
(41, 1, 'THEME_UPDATE', 'settings', 'Updated application theme & settings (RBAC Kiaan Starter).', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-07-17 07:51:28.979'),
(42, 1, 'THEME_UPDATE', 'settings', 'Updated application theme & settings (RBAC Kiaan Starter).', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-07-17 07:51:53.662'),
(43, 1, 'THEME_UPDATE', 'settings', 'Updated application theme & settings (RBAC Kiaan Starter).', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-07-17 07:52:04.349'),
(44, 1, 'THEME_UPDATE', 'settings', 'Updated application theme & settings (RBAC Kiaan Starter).', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-07-17 07:59:06.695'),
(45, 1, 'THEME_UPDATE', 'settings', 'Updated application theme & settings (RBAC Kiaan Starter).', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-07-17 07:59:12.613'),
(46, 1, 'MENU_CREATE', 'menus', 'Created menu item \"Documents\" (documents).', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-07-17 07:59:54.857'),
(47, 1, 'MENU_UPDATE', 'menus', 'Updated menu item \"Documents\".', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-07-17 08:01:01.990'),
(48, 1, 'MENU_UPDATE', 'menus', 'Updated menu item \"Clients\".', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-07-17 08:01:23.407'),
(49, 1, 'MENU_UPDATE', 'menus', 'Updated menu item \"Clients\".', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-07-17 08:01:29.063'),
(50, 4, 'LOGIN_GOOGLE', 'auth', 'User gautambairagi221999@gmail.com logged in via Google.', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-07-17 09:53:23.249'),
(51, 1, 'LOGIN', 'auth', 'User admin@example.com logged in.', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-07-17 09:54:37.794'),
(52, 1, 'LOGIN', 'auth', 'User admin@example.com logged in.', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-07-17 10:05:29.299'),
(53, 1, 'LOGIN', 'auth', 'User admin@example.com logged in.', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-07-17 10:18:55.700'),
(54, 5, 'LOGIN_GOOGLE', 'auth', 'User anmolvar36@gmail.com logged in via Google.', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-07-17 10:19:28.073'),
(55, 1, 'LOGIN', 'auth', 'User admin@example.com logged in.', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-07-17 10:19:54.821'),
(56, 1, 'THEME_UPDATE', 'settings', 'Updated application theme & settings (RBAC Kiaan Starter).', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-07-17 10:20:15.199'),
(57, 1, 'THEME_UPDATE', 'settings', 'Updated application theme & settings (RBAC Kiaan Starter).', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-07-17 10:20:20.004'),
(58, 1, 'THEME_UPDATE', 'settings', 'Updated application theme & settings (RBAC Kiaan Starter).', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-07-17 10:20:28.135'),
(59, 1, 'THEME_UPDATE', 'settings', 'Updated application theme & settings (RBAC Kiaan Starter).', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-07-17 10:20:33.460'),
(60, 1, 'THEME_UPDATE', 'settings', 'Updated application theme & settings (RBAC Kiaan Starter).', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-07-17 10:20:50.509'),
(61, 1, 'ROLE_CREATE', 'roles', 'Created new custom role \"nurse\" (nurse).', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-07-17 10:21:17.502'),
(62, 1, 'USER_CREATE', 'users', 'Created user account for naresh@gmail.com.', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-07-17 10:22:20.947'),
(63, 1, 'USER_PERMISSIONS_UPDATE', 'users', 'Updated permission overrides for user naresh@gmail.com.', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-07-17 10:22:40.795'),
(64, 6, 'LOGIN', 'auth', 'User naresh@gmail.com logged in.', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-07-17 10:22:56.122'),
(65, 1, 'LOGIN', 'auth', 'User admin@example.com logged in.', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-07-17 10:23:26.830'),
(66, 1, 'THEME_UPDATE', 'settings', 'Updated application theme & settings (hostpital).', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-07-17 10:23:41.589'),
(67, 1, 'LOGIN', 'auth', 'User admin@example.com logged in.', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-07-17 10:24:31.368'),
(68, 1, 'MENU_UPDATE', 'menus', 'Updated menu item \"Users\".', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-07-17 10:25:03.642'),
(69, 1, 'MENU_UPDATE', 'menus', 'Updated menu item \"Users\".', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-07-17 10:25:04.658'),
(70, 1, 'MENU_UPDATE', 'menus', 'Updated menu item \"Roles\".', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-07-17 10:25:06.749'),
(71, 1, 'MENU_UPDATE', 'menus', 'Updated menu item \"Menus\".', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-07-17 10:25:07.471'),
(72, 1, 'MENU_UPDATE', 'menus', 'Updated menu item \"Roles\".', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-07-17 10:25:08.372'),
(73, 1, 'MENU_UPDATE', 'menus', 'Updated menu item \"Menus\".', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-07-17 10:25:09.241'),
(74, 1, 'THEME_UPDATE', 'settings', 'Updated application theme & settings (hostpital).', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-07-17 10:27:55.155'),
(75, 1, 'THEME_UPDATE', 'settings', 'Updated application theme & settings (hostpital).', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-07-17 10:28:05.200'),
(76, 1, 'THEME_UPDATE', 'settings', 'Updated application theme & settings (hostpital).', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-07-17 10:28:14.938'),
(77, 1, 'THEME_UPDATE', 'settings', 'Updated application theme & settings (hostpital).', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-07-17 10:29:05.589'),
(78, 1, 'THEME_UPDATE', 'settings', 'Updated application theme & settings (hostpital).', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-07-17 10:32:24.648'),
(79, 1, 'THEME_UPDATE', 'settings', 'Updated application theme & settings (hostpital).', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-07-17 10:32:46.290'),
(80, 1, 'THEME_UPDATE', 'settings', 'Updated application theme & settings (hostpital).', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-07-17 10:32:54.766'),
(81, 1, 'THEME_UPDATE', 'settings', 'Updated application theme & settings (hostpital).', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-07-17 10:33:04.395'),
(82, 1, 'THEME_UPDATE', 'settings', 'Updated application theme & settings (hostpital).', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-07-17 10:33:29.150'),
(83, 1, 'THEME_UPDATE', 'settings', 'Updated application theme & settings (hostpital).', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-07-17 10:35:23.250'),
(84, 1, 'THEME_UPDATE', 'settings', 'Updated application theme & settings (hostpital).', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-07-17 10:35:30.971'),
(85, 1, 'THEME_UPDATE', 'settings', 'Updated application theme & settings (hostpital).', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-07-17 10:35:52.877'),
(86, 1, 'THEME_UPDATE', 'settings', 'Updated application theme & settings (hostpital).', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-07-17 10:35:59.911'),
(87, 1, 'THEME_UPDATE', 'settings', 'Updated application theme & settings (hostpital).', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-07-17 10:36:06.707'),
(88, 1, 'THEME_UPDATE', 'settings', 'Updated application theme & settings (hostpital).', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-07-17 10:36:42.324'),
(89, 1, 'THEME_UPDATE', 'settings', 'Updated application theme & settings (hostpital).', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-07-17 10:38:02.278'),
(90, 1, 'THEME_UPDATE', 'settings', 'Updated application theme & settings (GYM).', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-07-17 10:38:55.618'),
(91, 1, 'THEME_UPDATE', 'settings', 'Updated application theme & settings (GYM).', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-07-17 10:39:26.806'),
(92, 1, 'THEME_UPDATE', 'settings', 'Updated application theme & settings (GYM).', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-07-17 10:41:43.354'),
(93, 1, 'THEME_UPDATE', 'settings', 'Updated application theme & settings (SHOWROOM).', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-07-17 10:46:06.201'),
(94, 1, 'THEME_UPDATE', 'settings', 'Updated application theme & settings (SHOWROOM).', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-07-17 10:46:17.537'),
(95, 1, 'THEME_UPDATE', 'settings', 'Updated application theme & settings (SHOWROOM).', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-07-17 10:46:24.519');

-- --------------------------------------------------------

--
-- Table structure for table `app_settings`
--

CREATE TABLE `app_settings` (
  `id` int(11) NOT NULL,
  `app_name` varchar(100) NOT NULL DEFAULT 'RBAC Starter',
  `logo_url` varchar(255) DEFAULT NULL,
  `favicon_url` varchar(255) DEFAULT NULL,
  `primary_color` varchar(20) NOT NULL DEFAULT '#0d6efd',
  `secondary_color` varchar(20) NOT NULL DEFAULT '#6c757d',
  `updated_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `sidebar_color` varchar(20) NOT NULL DEFAULT '#0f172a',
  `font_family` varchar(100) NOT NULL DEFAULT 'Inter, system-ui, sans-serif',
  `font_size` varchar(20) NOT NULL DEFAULT '14px',
  `text_color` varchar(20) NOT NULL DEFAULT '#212529'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `app_settings`
--

INSERT INTO `app_settings` (`id`, `app_name`, `logo_url`, `favicon_url`, `primary_color`, `secondary_color`, `updated_at`, `sidebar_color`, `font_family`, `font_size`, `text_color`) VALUES
(1, 'SHOWROOM', 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQ_Zuz3haRHrSz0f3bnMlUTGa14Qc7Z5LLQ3-l04P98hv9CMXQU', NULL, '#5a9fd3', '#1fe523', '2026-07-17 10:46:24.509', '#8058ee', '\'Outfit\', system-ui, sans-serif', '16px', '#e84f7d');

-- --------------------------------------------------------

--
-- Table structure for table `menus`
--

CREATE TABLE `menus` (
  `id` int(11) NOT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `slug` varchar(100) NOT NULL,
  `route` varchar(255) NOT NULL,
  `icon` varchar(50) DEFAULT NULL,
  `position` int(11) NOT NULL DEFAULT 0,
  `is_dropdown` tinyint(1) NOT NULL DEFAULT 0,
  `is_visible` tinyint(1) NOT NULL DEFAULT 1,
  `is_active` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `menus`
--

INSERT INTO `menus` (`id`, `parent_id`, `name`, `slug`, `route`, `icon`, `position`, `is_dropdown`, `is_visible`, `is_active`) VALUES
(1, NULL, 'Users', 'users', '/users', 'FaUsers', 10, 0, 1, 1),
(2, NULL, 'Roles', 'roles', '/roles', 'FaUserShield', 20, 0, 1, 1),
(3, NULL, 'Menus', 'menus', '/menus', 'FaList', 30, 0, 1, 1),
(4, NULL, 'Permissions', 'permissions', '/permissions', 'FaKey', 40, 0, 1, 1),
(5, NULL, 'Activity Logs', 'activity_logs', '/activity-logs', 'FaHistory', 50, 0, 1, 1),
(6, NULL, 'Settings', 'settings', '/settings', 'FaPalette', 60, 0, 1, 1),
(7, NULL, 'Clients', 'clients', '/clients', 'FaBriefcase', 70, 0, 1, 1),
(8, NULL, 'Staff', 'staff', '/staff', 'FaUserTie', 80, 0, 1, 1),
(9, NULL, 'Reports', 'reports', '/reports', 'FaChartBar', 90, 0, 1, 1),
(10, NULL, 'Documents', 'documents', '/documents', 'FaBriefcase', 90, 0, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `token_hash` varchar(255) NOT NULL,
  `expires_at` datetime(3) NOT NULL,
  `used_at` datetime(3) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `request_ip` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `refresh_tokens`
--

CREATE TABLE `refresh_tokens` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `token_hash` varchar(255) NOT NULL,
  `expires_at` datetime(3) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `is_revoked` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `refresh_tokens`
--

INSERT INTO `refresh_tokens` (`id`, `user_id`, `token_hash`, `expires_at`, `created_at`, `is_revoked`) VALUES
(1, 1, '61745b39959066d3caa14dfa0c16fccf4e902a3bb889004dbbbb668b4c969948', '2026-07-24 06:26:08.432', '2026-07-17 06:26:08.435', 1),
(2, 1, '50530e6e24dfca56c2e4b32fe431feba4967a98f7fa204e19f5f51006a776500', '2026-07-24 06:28:59.100', '2026-07-17 06:28:59.101', 1),
(3, 1, 'ff1c69e58e8e3792c14f7b2001b7c046038196da85be806570e6de5a0448d3f7', '2026-07-24 06:30:53.656', '2026-07-17 06:30:53.658', 0),
(4, 1, 'cf998a5033710a18a61a02b2c14ff17d6d8b59b76919c4b34feaa02493f5e706', '2026-07-24 06:30:53.661', '2026-07-17 06:30:53.663', 1),
(5, 1, 'a3f41a7a30afc84e5234111e6a06d5dbac8cfd4dc23468f163a549064bb49773', '2026-07-24 06:35:00.757', '2026-07-17 06:35:00.759', 0),
(6, 1, 'a13b0a99e2c47ca865f16ecacca5eece0e3935f6dc173779723ddfef5ade364a', '2026-07-24 06:35:00.729', '2026-07-17 06:35:00.731', 1),
(7, 1, 'be211a6a320b3da67987b8a44daf790c5ec0a2208d384c1acb25fd4f4d5c2efa', '2026-07-24 06:37:15.161', '2026-07-17 06:37:15.162', 0),
(8, 1, 'fceb0883121cc4ea42d94d09822b7cf2cefe9a1d417d1bad46d0cca2bc4f469c', '2026-07-24 06:37:15.156', '2026-07-17 06:37:15.157', 1),
(9, 1, '1022138e973cf9d189bc824e1ebbaa3ae534c25e27a77a1191eac221d89cf96d', '2026-07-24 06:37:52.723', '2026-07-17 06:37:52.725', 0),
(10, 1, 'c18799830844616924844e6f5de9f87e570ff2b006196a0c2771ef46087a6976', '2026-07-24 06:41:10.792', '2026-07-17 06:41:10.793', 1),
(11, 1, '802227e6cd6c8aa38814c1fdfa0295befc60162d9af8b4b2c4c28a145fa53fb2', '2026-07-24 06:43:26.071', '2026-07-17 06:43:26.080', 1),
(12, 1, '80651f6ef372cbf0be1264af016376164b63b70180adec164fd673658ce96ac0', '2026-07-24 06:43:26.066', '2026-07-17 06:43:26.080', 0),
(13, 2, '0ee24ad4139f493404a491969be846ca6deeea343f66a4047b5ccdeca1b32aa3', '2026-07-24 06:44:40.985', '2026-07-17 06:44:40.987', 1),
(14, 1, '62abbaf7c5c2dab54fef62999b5bb9a37f211c25943106fabca2416e328ded02', '2026-07-24 06:45:12.220', '2026-07-17 06:45:12.221', 1),
(15, 2, '48c3125fab71ab1f3276e42480bf9530f76a19635f23b42c408e9d07eabc534e', '2026-07-24 06:46:13.092', '2026-07-17 06:46:13.093', 1),
(16, 1, 'ad919e3ae76ae271da0acdd1472fbea6e41e3c9f7f42a0859c8265d760fdcb4c', '2026-07-24 06:46:55.909', '2026-07-17 06:46:55.910', 1),
(17, 1, '1a0f8ed7b6233d8ba424742f4246d5bb35eebdb4969767af6422813b0cacecda', '2026-07-24 06:48:33.879', '2026-07-17 06:48:33.880', 1),
(18, 1, '4f6be2026ece41f6a8d36f4421566751bd1576a7ad46621306a5012c39a749c8', '2026-07-24 06:48:33.885', '2026-07-17 06:48:33.887', 0),
(19, 1, '2eac9e21d677313814ceceaa0e66ca98ddb8bbfa28af6bc235886e5a2cfb4f39', '2026-07-24 07:03:36.864', '2026-07-17 07:03:36.870', 1),
(20, 1, 'a3640a65034c6e4904b857c677ec991dc479c47019b314b8e8c3672b4457b3db', '2026-07-24 07:21:14.424', '2026-07-17 07:21:14.426', 1),
(21, 1, '37614edbd4815b2a2ed016825ef0fbbe89897130eba5da5692df5198ea4dbefc', '2026-07-24 07:25:32.480', '2026-07-17 07:25:32.483', 1),
(22, 1, 'a493adc1385c0dfc59b6f0c93c01a5dcf4fad7030b0cda7d8058881b5cedfb18', '2026-07-24 07:25:58.072', '2026-07-17 07:25:58.074', 0),
(23, 1, 'bac2bb8f1eedb6622083eca88907bc1e94f6f9713b2b9504d77bf9cbdf537b22', '2026-07-24 07:25:58.075', '2026-07-17 07:25:58.077', 1),
(24, 1, 'af76fc59de8eca364f5f4205516c453d5674bb2fac5d3bcfa74b7195a2af36b5', '2026-07-24 07:40:38.565', '2026-07-17 07:40:38.567', 1),
(25, 1, '5263edb675945ae61bae6e2d8d88bbfba9d6d04d0d95978e5b9d3c3a51f981f0', '2026-07-24 07:46:49.702', '2026-07-17 07:46:49.703', 1),
(26, 1, 'f41a0f41dbce010219b7193e12750c514c27a99b714671e00c5adb9cb83914da', '2026-07-24 07:46:49.705', '2026-07-17 07:46:49.706', 0),
(27, 1, '08463e7f8be74343f0ed1007ab8c8807feee4fc40c65b5bf858afb8c259ef69c', '2026-07-24 07:51:21.283', '2026-07-17 07:51:21.285', 0),
(28, 1, '2629b7ce8e7bd367050291bf9163f2dbee04352a1c058cb2afe7da46024d26d4', '2026-07-24 07:51:21.290', '2026-07-17 07:51:21.294', 1),
(29, 1, '76f1d27c703e0ada26916eaf0d127eff182a69940b0d192412150c7936041891', '2026-07-24 07:58:06.007', '2026-07-17 07:58:06.012', 0),
(30, 1, '5aed4bfc31c4f5aa7a88958ac9d314b418a50604e58b74e12913dbc9100ab4df', '2026-07-24 07:58:06.050', '2026-07-17 07:58:06.077', 1),
(31, 1, 'dc3f5a90977bbba3008f049f19bd0479ef5dc37098e436fd30934ee205b068cf', '2026-07-24 08:00:09.879', '2026-07-17 08:00:09.881', 0),
(32, 1, '515ea53f37def84ba080d8ed6cd43e0735f53851b337522ce9be4b846f213ad5', '2026-07-24 08:00:09.886', '2026-07-17 08:00:09.888', 1),
(33, 1, '242650e2e575fc1d76326f86db709ce718b7a135f30076b9ea3abdb0d1c240c4', '2026-07-24 08:01:05.695', '2026-07-17 08:01:05.697', 0),
(34, 1, '2b7617d61d0116c653eaed133a0fa6d73898272641e9d0c128b0ffdb13415dac', '2026-07-24 08:01:05.743', '2026-07-17 08:01:05.745', 1),
(35, 1, 'fb7c8cfef3f76cd490ddbd86db40032ea7a4cd8f06de137dc7c28d358f6dcddc', '2026-07-24 08:22:26.820', '2026-07-17 08:22:26.823', 0),
(36, 1, '68455e92c499c6d6f2876d9b749ac5d8e7b013c044df5d6143d403a978c3ff3a', '2026-07-24 08:22:26.832', '2026-07-17 08:22:26.834', 1),
(37, 4, 'f630cc201fbe433112c04e23c64a8a50ef111ae3a14e4dfac7768c5f21b9e764', '2026-07-24 09:53:23.236', '2026-07-17 09:53:23.239', 1),
(38, 1, 'e68cd9315b494fc941422e71c73fb5133526b09e2c21bfc2bb0714724f38d37c', '2026-07-24 09:54:37.769', '2026-07-17 09:54:37.770', 1),
(39, 1, '550471fed9aec038225e2e7b4e7aa5df2c54bafd057926b13e05a09238122dcf', '2026-07-24 10:05:29.273', '2026-07-17 10:05:29.275', 1),
(40, 1, 'a068b774e4244348d0a8c3fce0fe70be8273a212d9e44eed4a23a8b3d92a7dda', '2026-07-24 10:06:36.629', '2026-07-17 10:06:36.632', 1),
(41, 1, '8bdfc1277257353508813000f0d445dfd5a075b913af73043f4aefc72a57d0ba', '2026-07-24 10:18:55.678', '2026-07-17 10:18:55.679', 1),
(42, 5, '0e32988755621d966a559e4097545509cec1c332cbbaaa406ce7228b1d125c77', '2026-07-24 10:19:28.063', '2026-07-17 10:19:28.065', 1),
(43, 1, 'dca0651b3a90b2adbdf4e73da8ee1063543923ad933993588133bdd49017a4dc', '2026-07-24 10:19:54.795', '2026-07-17 10:19:54.797', 1),
(44, 6, '9022040ca9eaa038f3a7d62c94c0a5f57d40602e8f9bf356970fd6ebcd315eb8', '2026-07-24 10:22:56.086', '2026-07-17 10:22:56.087', 1),
(45, 1, '46f809f44b2e02193c0e9310c249d893c6a2dc45b1e225704ec0e5fb5ee9a1f2', '2026-07-24 10:23:26.748', '2026-07-17 10:23:26.749', 1),
(46, 1, '1acc1df1fb683efb412e57f827864d46bd424368943c498753bafc8c9d369a04', '2026-07-24 10:24:31.320', '2026-07-17 10:24:31.322', 1),
(47, 1, '11fe467d1049fe79a2be6608589facb06d89ff676277ace67e752f72ad3fd969', '2026-07-24 10:32:29.885', '2026-07-17 10:32:29.886', 1),
(48, 1, '74c9c9c00aaa89228897ab37fd166c4bce7d481cd3264744aecd73d05853790e', '2026-07-24 10:32:58.302', '2026-07-17 10:32:58.303', 1),
(49, 1, '80ed7e98c62568baa58e9ad3420094a639682cf12cbc2b8202687dbe20f16e19', '2026-07-24 10:35:04.234', '2026-07-17 10:35:04.237', 1),
(50, 1, 'f997fada8f02a3b5fc1eb9ead9a996818a693a4d64873763e44356575b1decbb', '2026-07-24 10:35:33.685', '2026-07-17 10:35:33.687', 1),
(51, 1, 'f86476e638dda940f1f360b68041c7131e2b4ec898585f503b2af11568f71840', '2026-07-24 10:37:47.345', '2026-07-17 10:37:47.347', 0);

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `slug` varchar(50) NOT NULL,
  `is_system` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `slug`, `is_system`, `created_at`) VALUES
(1, 'Super Admin', 'super_admin', 1, '2026-07-17 06:21:19.518'),
(2, 'Admin', 'admin', 1, '2026-07-17 06:21:19.530'),
(3, 'Manager', 'manager', 1, '2026-07-17 06:21:19.543'),
(4, 'User', 'user', 1, '2026-07-17 06:21:19.548'),
(5, 'client', 'client', 0, '2026-07-17 06:50:27.832'),
(6, 'nurse', 'nurse', 0, '2026-07-17 10:21:17.482');

-- --------------------------------------------------------

--
-- Table structure for table `role_permissions`
--

CREATE TABLE `role_permissions` (
  `id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  `menu_id` int(11) NOT NULL,
  `can_view` tinyint(1) NOT NULL DEFAULT 0,
  `can_create` tinyint(1) NOT NULL DEFAULT 0,
  `can_update` tinyint(1) NOT NULL DEFAULT 0,
  `can_delete` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `role_permissions`
--

INSERT INTO `role_permissions` (`id`, `role_id`, `menu_id`, `can_view`, `can_create`, `can_update`, `can_delete`) VALUES
(1, 2, 1, 0, 0, 0, 0),
(2, 2, 2, 0, 0, 0, 0),
(3, 2, 3, 0, 0, 0, 0),
(4, 2, 4, 0, 0, 0, 0),
(5, 2, 5, 0, 0, 0, 0),
(6, 2, 6, 0, 0, 0, 0),
(7, 2, 7, 0, 0, 0, 0),
(8, 2, 8, 0, 0, 0, 0),
(9, 2, 9, 0, 0, 0, 0),
(10, 3, 1, 0, 0, 0, 0),
(11, 3, 2, 0, 0, 0, 0),
(12, 3, 3, 0, 0, 0, 0),
(13, 3, 4, 0, 0, 0, 0),
(14, 3, 5, 0, 0, 0, 0),
(15, 3, 6, 0, 0, 0, 0),
(16, 3, 7, 0, 0, 0, 0),
(17, 3, 8, 0, 0, 0, 0),
(18, 3, 9, 0, 0, 0, 0),
(19, 4, 1, 0, 0, 0, 0),
(20, 4, 2, 0, 0, 0, 0),
(21, 4, 3, 0, 0, 0, 0),
(22, 4, 4, 0, 0, 0, 0),
(23, 4, 5, 0, 0, 0, 0),
(24, 4, 6, 0, 0, 0, 0),
(25, 4, 7, 0, 0, 0, 0),
(26, 4, 8, 0, 0, 0, 0),
(27, 4, 9, 0, 0, 0, 0),
(28, 5, 1, 0, 0, 0, 0),
(29, 5, 2, 0, 0, 0, 0),
(30, 5, 3, 0, 0, 0, 0),
(31, 5, 4, 0, 0, 0, 0),
(32, 5, 5, 0, 0, 0, 0),
(33, 5, 6, 0, 0, 0, 0),
(34, 5, 7, 0, 0, 0, 0),
(35, 5, 8, 0, 0, 0, 0),
(36, 5, 9, 0, 0, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `profile_image_url` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` int(11) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `role_id`, `email`, `password_hash`, `first_name`, `last_name`, `phone`, `profile_image_url`, `is_active`, `created_by`, `created_at`) VALUES
(1, 1, 'admin@example.com', '$2b$12$OdLTRHHR7RvsF5a77H4iU.cqVCY/s/zIhSCcT61LgzXc3tEy7xLnO', 'Super', 'Admin', NULL, NULL, 1, NULL, '2026-07-17 06:21:19.909'),
(2, 2, 'neha@gmail.com', '$2b$12$4FYFSQvwhFlt6KrfZ5W5DOb2znKBbBAYoj1Y498zlUnfh5l3CI3vG', 'neha', 'singh', '1234567890', NULL, 1, 1, '2026-07-17 06:30:48.482'),
(3, 4, 'user@gmail.com', '$2b$12$k6g1vxIQvtjen8YTnh3LS.oM9o5qjLnCKpOnazbGYwE97YNyhLdNa', 'user', 'singh', '123456789', NULL, 1, 1, '2026-07-17 07:27:05.306'),
(4, 4, 'gautambairagi221999@gmail.com', '$2b$12$IQjcjU4WXW/4bvuzmnpPCuCJNyD/2Ua3yIfjVxad2kp.Xc336ImT2', 'gautam', 'bairagi', NULL, 'https://lh3.googleusercontent.com/a/ACg8ocKdoemwBeEKolW5OnVkA6FDRrImRqA7m6nppfadreUMhdPO5w=s96-c', 1, NULL, '2026-07-17 09:53:23.157'),
(5, 4, 'anmolvar36@gmail.com', '$2b$12$za1OlzMUlo4WWpPuksEwquRp4vDwEVxTHO0zlvIun12WUQYocuOcW', 'anmol', 'varma', NULL, 'https://lh3.googleusercontent.com/a/ACg8ocL4gTq1G68w9jdXxe5leoQNTlRNFF_SUzylft15m-DveeB3iQ=s96-c', 1, NULL, '2026-07-17 10:19:28.020'),
(6, 4, 'naresh@gmail.com', '$2b$12$lg9vdjfvoa5zefSxCIDm8.4SPCxgWRCxgYN5OTG9FkDF0wVO1cWhS', 'naresh', 'singh', '123465798', NULL, 1, 1, '2026-07-17 10:22:20.924');

-- --------------------------------------------------------

--
-- Table structure for table `user_permission_overrides`
--

CREATE TABLE `user_permission_overrides` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `menu_id` int(11) NOT NULL,
  `can_view` tinyint(1) DEFAULT NULL,
  `can_create` tinyint(1) DEFAULT NULL,
  `can_update` tinyint(1) DEFAULT NULL,
  `can_delete` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_permission_overrides`
--

INSERT INTO `user_permission_overrides` (`id`, `user_id`, `menu_id`, `can_view`, `can_create`, `can_update`, `can_delete`) VALUES
(1, 2, 5, 1, 1, 1, 1),
(2, 6, 1, 1, NULL, NULL, NULL),
(3, 6, 2, 1, NULL, NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `activity_logs_user_id_fkey` (`user_id`);

--
-- Indexes for table `app_settings`
--
ALTER TABLE `app_settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `menus`
--
ALTER TABLE `menus`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `menus_slug_key` (`slug`),
  ADD KEY `menus_parent_id_fkey` (`parent_id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `password_reset_tokens_token_hash_key` (`token_hash`),
  ADD KEY `password_reset_tokens_user_id_fkey` (`user_id`);

--
-- Indexes for table `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `refresh_tokens_token_hash_key` (`token_hash`),
  ADD KEY `refresh_tokens_user_id_fkey` (`user_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `roles_name_key` (`name`),
  ADD UNIQUE KEY `roles_slug_key` (`slug`);

--
-- Indexes for table `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `role_permissions_role_id_menu_id_key` (`role_id`,`menu_id`),
  ADD KEY `role_permissions_menu_id_fkey` (`menu_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_key` (`email`),
  ADD KEY `users_role_id_fkey` (`role_id`),
  ADD KEY `users_created_by_fkey` (`created_by`);

--
-- Indexes for table `user_permission_overrides`
--
ALTER TABLE `user_permission_overrides`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_permission_overrides_user_id_menu_id_key` (`user_id`,`menu_id`),
  ADD KEY `user_permission_overrides_menu_id_fkey` (`menu_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activity_logs`
--
ALTER TABLE `activity_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=96;

--
-- AUTO_INCREMENT for table `app_settings`
--
ALTER TABLE `app_settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `menus`
--
ALTER TABLE `menus`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `role_permissions`
--
ALTER TABLE `role_permissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `user_permission_overrides`
--
ALTER TABLE `user_permission_overrides`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD CONSTRAINT `activity_logs_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `menus`
--
ALTER TABLE `menus`
  ADD CONSTRAINT `menus_parent_id_fkey` FOREIGN KEY (`parent_id`) REFERENCES `menus` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD CONSTRAINT `password_reset_tokens_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  ADD CONSTRAINT `refresh_tokens_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD CONSTRAINT `role_permissions_menu_id_fkey` FOREIGN KEY (`menu_id`) REFERENCES `menus` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `role_permissions_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `users_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `user_permission_overrides`
--
ALTER TABLE `user_permission_overrides`
  ADD CONSTRAINT `user_permission_overrides_menu_id_fkey` FOREIGN KEY (`menu_id`) REFERENCES `menus` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `user_permission_overrides_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
