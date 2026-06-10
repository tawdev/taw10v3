CREATE TABLE `team_members` (
    `id` VARCHAR(191) NOT NULL,
    `name_fr` VARCHAR(191) NOT NULL,
    `name_en` VARCHAR(191) NOT NULL,
    `name_ar` VARCHAR(191) NOT NULL,
    `role_fr` VARCHAR(191) NOT NULL,
    `role_en` VARCHAR(191) NOT NULL,
    `role_ar` VARCHAR(191) NOT NULL,
    `description_fr` TEXT NOT NULL,
    `description_en` TEXT NOT NULL,
    `description_ar` TEXT NOT NULL,
    `imageUrl` VARCHAR(191) NOT NULL,
    `sortOrder` INTEGER NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `team_members_sortOrder_key`(`sortOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
