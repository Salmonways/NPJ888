-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: Nov 28, 2024 at 05:52 AM
-- Server version: 5.7.39
-- PHP Version: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `CSS325_project`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `Admin_id` int(11) NOT NULL,
  `User_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`Admin_id`, `User_id`) VALUES
(1, 2);

-- --------------------------------------------------------

--
-- Table structure for table `games`
--

CREATE TABLE `games` (
  `Game_id` int(11) NOT NULL,
  `Game_name` varchar(255) NOT NULL,
  `Game_type` varchar(100) NOT NULL,
  `Status` enum('Available','Unavailable') DEFAULT 'Unavailable',
  `current_players` int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `games`
--

INSERT INTO `games` (`Game_id`, `Game_name`, `Game_type`, `Status`, `current_players`) VALUES
(2, 'CSGO_empire', 'Roulette', 'Available', 5),
(3, 'Sweet Bonanza betting', 'Slot ', 'Unavailable', 0),
(4, 'Olympus betting', 'Slot', 'Unavailable', 0),
(5, 'Lepreshaun riches betting', 'Slot', 'Unavailable', 0);

-- --------------------------------------------------------

--
-- Table structure for table `leaderboard`
--

CREATE TABLE `leaderboard` (
  `Leaderboard_id` int(11) NOT NULL,
  `User_id` int(11) NOT NULL,
  `Game_id` int(11) NOT NULL,
  `Profit` decimal(15,2) NOT NULL,
  `win_type` enum('daily','monthly') NOT NULL,
  `win_date` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `leaderboard`
--

INSERT INTO `leaderboard` (`Leaderboard_id`, `User_id`, `Game_id`, `Profit`, `win_type`, `win_date`, `created_at`) VALUES
(12, 17, 2, '2343.00', 'daily', '2024-11-21', '2024-11-21 02:18:52'),
(13, 18, 2, '3422.00', 'daily', '2024-11-21', '2024-11-21 02:19:33'),
(16, 17, 2, '21322.00', 'monthly', '2024-11-21', '2024-11-21 02:21:19'),
(17, 18, 2, '23324.00', 'monthly', '2024-11-21', '2024-11-21 02:21:19');

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `transactionId` varchar(36) DEFAULT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('Confirmed','Pending','Failed') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`id`, `userId`, `amount`, `transactionId`, `date`, `status`) VALUES
(53, 18, '10000.00', '05416438-f954-4339-b2b7-9739a3de824a', '2024-11-20 09:06:18', 'Confirmed'),
(61, 18, '100000.00', 'e060df31-3058-4451-8f88-715e8f40625a', '2024-11-25 08:15:25', 'Confirmed'),
(62, 21, '1000.00', 'c3249b46-5303-4ffa-9e8b-e2e18dcb30a5', '2024-11-28 03:16:33', 'Confirmed'),
(63, 21, '-50.01', '4e14dbbc-b356-49ac-8f48-fffc2a368c53', '2024-11-28 03:17:39', 'Confirmed');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `User_id` int(11) NOT NULL,
  `Username` varchar(255) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `Email` varchar(255) NOT NULL,
  `Status` enum('active','inactive') NOT NULL,
  `Date_of_birth` date DEFAULT NULL,
  `Registeration_date` date DEFAULT NULL,
  `User_type` varchar(10) DEFAULT NULL,
  `Balance` float NOT NULL DEFAULT '0',
  `Game_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`User_id`, `Username`, `Password`, `Email`, `Status`, `Date_of_birth`, `Registeration_date`, `User_type`, `Balance`, `Game_id`) VALUES
(2, 'admin1', 'bog4sls008WaXBe8rU8f4A==', 'admin1', 'active', NULL, NULL, 'admin', 10000, NULL),
(17, 'test10', '$2b$10$Arh59w891s1BMKdnjnq1Geb3YNNClXioABjH1RWfOwdq3zV1kQS/e', 'test10', 'active', NULL, NULL, 'customer', 0, 2),
(18, 'test11', '$2b$10$FN8wpv.IO0MSeqwLqrJAfuYl58MgBVDcH6VcgBq4Fr9wv0kembb1u', 'test11', 'inactive', NULL, NULL, 'customer', 17000, 2),
(21, 'test15', '$2b$10$TSDczfti0SgHN4GH9y/eju4mKYt1fhHnizkLWx8jbQ/qw3IJBQDze', 'test15', 'active', NULL, NULL, 'customer', 799.99, 2);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`Admin_id`),
  ADD KEY `User_id` (`User_id`);

--
-- Indexes for table `games`
--
ALTER TABLE `games`
  ADD PRIMARY KEY (`Game_id`);

--
-- Indexes for table `leaderboard`
--
ALTER TABLE `leaderboard`
  ADD PRIMARY KEY (`Leaderboard_id`),
  ADD KEY `User_id` (`User_id`),
  ADD KEY `Game_id` (`Game_id`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`User_id`),
  ADD KEY `fk_game` (`Game_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `Admin_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `games`
--
ALTER TABLE `games`
  MODIFY `Game_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `leaderboard`
--
ALTER TABLE `leaderboard`
  MODIFY `Leaderboard_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=64;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `User_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `admin`
--
ALTER TABLE `admin`
  ADD CONSTRAINT `admin_ibfk_1` FOREIGN KEY (`User_id`) REFERENCES `users` (`User_id`);

--
-- Constraints for table `leaderboard`
--
ALTER TABLE `leaderboard`
  ADD CONSTRAINT `leaderboard_ibfk_1` FOREIGN KEY (`User_id`) REFERENCES `users` (`User_id`) ON DELETE CASCADE;

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`User_id`) ON DELETE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `fk_game` FOREIGN KEY (`Game_id`) REFERENCES `games` (`Game_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
