CREATE TABLE `pricing_plans` (
  `id` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `price` INTEGER NOT NULL,
  `description` TEXT NOT NULL,
  `theme` ENUM('DEFAULT', 'FEATURED', 'PREMIUM') NOT NULL DEFAULT 'DEFAULT',
  `isPopular` BOOLEAN NOT NULL DEFAULT false,
  `isActive` BOOLEAN NOT NULL DEFAULT true,
  `sortOrder` INTEGER NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,

  UNIQUE INDEX `pricing_plans_sortOrder_key`(`sortOrder`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `pricing_features` (
  `id` VARCHAR(191) NOT NULL,
  `planId` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `isIncluded` BOOLEAN NOT NULL DEFAULT true,
  `sortOrder` INTEGER NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,

  INDEX `pricing_features_planId_idx`(`planId`),
  UNIQUE INDEX `pricing_features_planId_sortOrder_key`(`planId`, `sortOrder`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `pricing_features`
  ADD CONSTRAINT `pricing_features_planId_fkey`
  FOREIGN KEY (`planId`) REFERENCES `pricing_plans`(`id`)
  ON DELETE CASCADE ON UPDATE CASCADE;
