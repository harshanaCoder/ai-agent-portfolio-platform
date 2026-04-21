import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const root = process.cwd();

const targets = [
  {
    file: path.join(root, "lib", "normalMode", "projects.ts"),
    patterns: [
      { regex: /"thumbnail"\s*:\s*"([^"\n]+)"/g, label: "thumbnail" },
      { regex: /["']?slug["']?\s*:\s*"([^"\n]+)"/g, label: "slug" }
    ]
  },
  {
    file: path.join(root, "lib", "normalMode", "credentials.ts"),
    patterns: [
      { regex: /credentialImage\s*:\s*"([^"\n]+)"/g, label: "credentialImage" },
      { regex: /issuerLogo\s*:\s*"([^"\n]+)"/g, label: "issuerLogo" },
      { regex: /["']?slug["']?\s*:\s*"([^"\n]+)"/g, label: "slug" }
    ]
  }
];

function toPublicPath(assetPath) {
  return path.join(root, "public", assetPath.replace(/^\//, ""));
}

async function validate() {
  const errors = [];

  for (const target of targets) {
    const text = await readFile(target.file, "utf8");

    for (const pattern of target.patterns) {
      const matches = [...text.matchAll(pattern.regex)];

      if (pattern.label === "slug") {
        const slugValues = matches.map((m) => m[1]).filter(Boolean);
        const duplicates = slugValues.filter((slug, idx) => slugValues.indexOf(slug) !== idx);

        if (duplicates.length > 0) {
          const uniqueDuplicates = [...new Set(duplicates)];
          for (const duplicate of uniqueDuplicates) {
            errors.push(`${path.relative(root, target.file)} has duplicate slug: ${duplicate}`);
          }
        }

        continue;
      }

      for (const match of matches) {
        const assetPath = match[1];

        if (!assetPath.startsWith("/")) {
          errors.push(`${path.relative(root, target.file)} has non-public ${pattern.label} path: ${assetPath}`);
          continue;
        }

        const fullAssetPath = toPublicPath(assetPath);
        if (!existsSync(fullAssetPath)) {
          errors.push(`${path.relative(root, target.file)} references missing ${pattern.label}: ${assetPath}`);
        }
      }
    }
  }

  if (errors.length > 0) {
    console.error("Content validation failed:\n");
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exit(1);
  }

  console.log("Content validation passed.");
}

validate().catch((error) => {
  console.error("Validation crashed:", error);
  process.exit(1);
});
