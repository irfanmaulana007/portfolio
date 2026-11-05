-- Data migration: hide the Source Code button for client/private projects by
-- clearing their codeUrl (the projects section hides the button when codeUrl is
-- falsy). These rows were seeded before this decision, so correct them here.
-- Idempotent: safe to run repeatedly.
UPDATE "Project" SET "codeUrl" = NULL
WHERE "slug" IN ('gym-assistant', 'mahad-albilad');
