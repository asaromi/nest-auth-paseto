-- DropIndex
DROP INDEX `product_licenses_licenseId_productId_idx` ON `product_licenses`;

-- AlterTable
ALTER TABLE `licenses` MODIFY `updatedDate` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `product_licenses` MODIFY `deviceInfo` VARCHAR(255) NULL,
    MODIFY `macAddess` VARCHAR(128) NULL,
    MODIFY `assignedAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `products` MODIFY `updatedDate` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `updatedDate` DATETIME(3) NULL;

-- CreateIndex
CREATE INDEX `product_licenses_productId_idx` ON `product_licenses`(`productId`);

-- CreateIndex
CREATE INDEX `product_licenses_licenseId_idx` ON `product_licenses`(`licenseId`);
