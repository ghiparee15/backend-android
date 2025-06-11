-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 11 Jun 2025 pada 16.18
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `backendex`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `comment`
--

CREATE TABLE `comment` (
  `id` int(11) NOT NULL,
  `content` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `tweetId` int(11) NOT NULL,
  `userId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `like`
--

CREATE TABLE `like` (
  `id` int(11) NOT NULL,
  `tweetId` int(11) NOT NULL,
  `userId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `like`
--

INSERT INTO `like` (`id`, `tweetId`, `userId`) VALUES
(1, 2, 3),
(3, 4, 3),
(6, 4, 6),
(4, 5, 3),
(8, 5, 4),
(5, 6, 3),
(7, 6, 6),
(9, 7, 4),
(11, 7, 6);

-- --------------------------------------------------------

--
-- Struktur dari tabel `tweet`
--

CREATE TABLE `tweet` (
  `id` int(11) NOT NULL,
  `content` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `userId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `tweet`
--

INSERT INTO `tweet` (`id`, `content`, `createdAt`, `userId`) VALUES
(1, 'aaa', '2025-06-10 00:17:36.830', 3),
(2, 'bcd', '2025-06-10 05:34:20.073', 3),
(3, 'ppp', '2025-06-10 05:34:41.433', 3),
(4, 'pppp', '2025-06-10 05:34:44.202', 3),
(5, 'ppp', '2025-06-10 05:34:45.485', 3),
(6, 'ppp', '2025-06-10 05:34:47.061', 3),
(7, 'Hello', '2025-06-11 14:15:46.343', 4);

-- --------------------------------------------------------

--
-- Struktur dari tabel `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `username` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `password` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `user`
--

INSERT INTO `user` (`id`, `username`, `email`, `password`) VALUES
(2, 'testuser', 'test@example.com', '$2b$10$8cYwR0bJ3bQP4OA3YfnP5.a1uI8fqSUegegs0BrSt2NELjwgd70Z.'),
(3, 'Fari', 'fari@gmail.com', '$2b$10$HLlxhv/LPq5LO9YTSMpnm.KkaIwa2nEbNjdqVnC5YbCvpgB3snAD2'),
(4, 'Givari Hardiansyah', 'givari@gmail.com', '$2b$10$vidT1WVC62QKyF4bouYJ1.PcsKPzkn7XojhyBBJN9rWlFFGyU0HlK'),
(5, 'Luthfi Alif', 'lutjfi@gmail.com', '$2b$10$ENKgzmd2RWwgRzBgv2Bs6uy5oK.WgvPsKcMvO.F6PDfz7jM3ELlte'),
(6, 'Rosyidah', 'rosyidah@gmail.com', '$2b$10$Qul3lN/iWx.etID7DF842.CbrP0uyQAMQbRrEICZY5E.36UhadBPi');

-- --------------------------------------------------------

--
-- Struktur dari tabel `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) NOT NULL,
  `checksum` varchar(64) NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) NOT NULL,
  `logs` text DEFAULT NULL,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int(10) UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('9440c353-74ab-4e97-b3e8-035667a3f36b', '9fb47d7f80bb782ab5356c2374ec43ad76794bdd4c08557af1ac3804fcbcaf3e', '2025-06-09 22:23:13.726', '20250609222313_init', NULL, NULL, '2025-06-09 22:23:13.569', 1);

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `comment`
--
ALTER TABLE `comment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Comment_tweetId_fkey` (`tweetId`),
  ADD KEY `Comment_userId_fkey` (`userId`);

--
-- Indeks untuk tabel `like`
--
ALTER TABLE `like`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Like_tweetId_userId_key` (`tweetId`,`userId`),
  ADD KEY `Like_userId_fkey` (`userId`);

--
-- Indeks untuk tabel `tweet`
--
ALTER TABLE `tweet`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Tweet_userId_fkey` (`userId`);

--
-- Indeks untuk tabel `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `User_username_key` (`username`),
  ADD UNIQUE KEY `User_email_key` (`email`);

--
-- Indeks untuk tabel `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `comment`
--
ALTER TABLE `comment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `like`
--
ALTER TABLE `like`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT untuk tabel `tweet`
--
ALTER TABLE `tweet`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT untuk tabel `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `comment`
--
ALTER TABLE `comment`
  ADD CONSTRAINT `Comment_tweetId_fkey` FOREIGN KEY (`tweetId`) REFERENCES `tweet` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Comment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `like`
--
ALTER TABLE `like`
  ADD CONSTRAINT `Like_tweetId_fkey` FOREIGN KEY (`tweetId`) REFERENCES `tweet` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Like_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `tweet`
--
ALTER TABLE `tweet`
  ADD CONSTRAINT `Tweet_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
