-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(26) NOT NULL,
    `username` VARCHAR(20) NOT NULL,
    `fullName` VARCHAR(64) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `createdDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedDate` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
