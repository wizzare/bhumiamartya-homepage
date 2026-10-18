import fs from "node:fs";
import path from "node:path";

try {
  const esmPkgPath = path.resolve("node_modules", "astronomy-engine", "esm", "package.json");
  if (!fs.existsSync(esmPkgPath)) {
    fs.mkdirSync(path.dirname(esmPkgPath), { recursive: true });
    fs.writeFileSync(esmPkgPath, JSON.stringify({ type: "module" }, null, 2));
    console.log("Patched astronomy-engine/esm/package.json");
  }
  const rootPkgPath = path.resolve("node_modules", "astronomy-engine", "package.json");
  if (fs.existsSync(rootPkgPath)) {
    const rootPkg = JSON.parse(fs.readFileSync(rootPkgPath, "utf8"));
    if (rootPkg.type !== "module") {
      rootPkg.type = "module";
      fs.writeFileSync(rootPkgPath, JSON.stringify(rootPkg, null, 2));
      console.log("Patched astronomy-engine/package.json with type: module");
    }
  }
} catch (err) {
  console.warn("Could not patch astronomy-engine:", err.message);
}
