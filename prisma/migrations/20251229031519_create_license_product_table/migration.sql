-- CreateTable
CREATE TABLE `products` (
    `id` VARCHAR(26) NOT NULL,
    `name` VARCHAR(64) NOT NULL,
    `sku` VARCHAR(32) NOT NULL,
    `createdBy` VARCHAR(26) NOT NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `createdDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedDate` DATETIME(3) NOT NULL,

    UNIQUE INDEX `products_sku_key`(`sku`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `licenses` (
    `id` VARCHAR(26) NOT NULL,
    `code` VARCHAR(32) NOT NULL,
    `qty` INTEGER UNSIGNED NOT NULL,
    `createdBy` VARCHAR(26) NOT NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `createdDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedDate` DATETIME(3) NOT NULL,

    UNIQUE INDEX `licenses_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product_licenses` (
    `id` VARCHAR(26) NOT NULL,
    `productId` VARCHAR(26) NOT NULL,
    `licenseId` VARCHAR(26) NOT NULL,
    `deviceInfo` VARCHAR(255) NOT NULL,
    `macAddess` VARCHAR(128) NOT NULL,
    `assignedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `isActive` BOOLEAN NOT NULL DEFAULT false,

    INDEX `product_licenses_licenseId_productId_idx`(`licenseId`, `productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
