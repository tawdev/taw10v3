CREATE TABLE `faq_items` (
  `id` VARCHAR(191) NOT NULL,
  `question` VARCHAR(191) NOT NULL,
  `answer` TEXT NOT NULL,
  `sortOrder` INTEGER NOT NULL,
  `isActive` BOOLEAN NOT NULL DEFAULT true,
  `likeCount` INTEGER NOT NULL DEFAULT 0,
  `dislikeCount` INTEGER NOT NULL DEFAULT 0,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,

  UNIQUE INDEX `faq_items_sortOrder_key`(`sortOrder`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
