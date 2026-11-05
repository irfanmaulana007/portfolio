-- CreateTable
CREATE TABLE "SiteProfile" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "developerSince" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialLink" (
    "id" SERIAL NOT NULL,
    "platform" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SocialLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NavItem" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "href" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NavItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SocialLink_platform_key" ON "SocialLink"("platform");

-- CreateIndex
CREATE INDEX "SocialLink_sortOrder_idx" ON "SocialLink"("sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "NavItem_href_key" ON "NavItem"("href");

-- CreateIndex
CREATE INDEX "NavItem_sortOrder_idx" ON "NavItem"("sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "Skill_name_key" ON "Skill"("name");

-- CreateIndex
CREATE INDEX "Skill_sortOrder_idx" ON "Skill"("sortOrder");

-- Data migration: seed the site content so an existing deployment is never
-- blank after this migration runs (migrate deploy runs automatically on
-- deploy; the seed does not). ON CONFLICT DO NOTHING keeps this idempotent and
-- never overwrites rows later edited directly in the DB. Mirrors the snapshot
-- in prisma/seed.ts (seedProfileData).
INSERT INTO "SiteProfile" ("id", "name", "role", "bio", "phone", "email", "location", "developerSince", "updatedAt")
VALUES (1, 'Irfan Maulana', 'Frontend Developer', 'A passionate frontend developer with expertise in building modern web applications using React, Next.js, and Tailwind CSS.', '+62 851-5879-0074', 'professional.irfanmaulana007@gmail.com', 'DKI Jakarta, Indonesia', '2018', CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

INSERT INTO "SocialLink" ("platform", "url", "label", "sortOrder", "updatedAt")
VALUES
  ('github', 'https://github.com/irfanmaulana007', 'GitHub', 0, CURRENT_TIMESTAMP),
  ('linkedin', 'https://linkedin.com/in/irfanmaulana007', 'LinkedIn', 1, CURRENT_TIMESTAMP),
  ('twitter', 'https://twitter.com/irfanmaulana007', 'Twitter', 2, CURRENT_TIMESTAMP),
  ('instagram', 'https://instagram.com/irfanmaulana007', 'Instagram', 3, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

INSERT INTO "NavItem" ("name", "href", "sortOrder", "updatedAt")
VALUES
  ('Home', '#home', 0, CURRENT_TIMESTAMP),
  ('About', '#about', 1, CURRENT_TIMESTAMP),
  ('Projects', '#projects', 2, CURRENT_TIMESTAMP),
  ('Skills', '#skills', 3, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

INSERT INTO "Skill" ("name", "level", "sortOrder", "updatedAt")
VALUES
  ('HTML5', 95, 0, CURRENT_TIMESTAMP),
  ('CSS3/SCSS', 90, 1, CURRENT_TIMESTAMP),
  ('JavaScript (ES6+)', 90, 2, CURRENT_TIMESTAMP),
  ('TypeScript', 85, 3, CURRENT_TIMESTAMP),
  ('React.js', 90, 4, CURRENT_TIMESTAMP),
  ('Next.js', 85, 5, CURRENT_TIMESTAMP),
  ('Tailwind CSS', 90, 6, CURRENT_TIMESTAMP),
  ('Framer Motion', 75, 7, CURRENT_TIMESTAMP),
  ('Git/GitHub', 85, 8, CURRENT_TIMESTAMP),
  ('Figma', 80, 9, CURRENT_TIMESTAMP),
  ('Responsive Design', 95, 10, CURRENT_TIMESTAMP),
  ('Performance Optimization', 90, 11, CURRENT_TIMESTAMP),
  ('Accessibility (a11y)', 85, 12, CURRENT_TIMESTAMP),
  ('SEO Basics', 75, 13, CURRENT_TIMESTAMP),
  ('Testing (Jest, RTL)', 70, 14, CURRENT_TIMESTAMP),
  ('CI/CD', 65, 15, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;
