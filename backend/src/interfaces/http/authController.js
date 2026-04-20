import jwt from "jsonwebtoken";
import { AppConfig } from "../../patterns/singleton/AppConfig.js";
import { UserFactory } from "../../patterns/factory/UserFactory.js";

function assertActiveAccount(record, res) {
  const status = record.accountStatus ?? "active";
  if (status === "pending") {
    res.status(403).json({ message: "Your account is pending admin approval. Try again after approval." });
    return false;
  }
  if (status === "rejected") {
    res.status(403).json({ message: "Your registration was rejected. Contact an administrator." });
    return false;
  }
  return true;
}

export function createAuthController(store) {
  const secret = AppConfig.getInstance().jwtSecret;

  function signForUser(record) {
    const profile = UserFactory.fromRecord(record);
    const dto = profile.toPublicDTO();
    const token = jwt.sign({ sub: dto.id, role: dto.role, email: dto.email }, secret, { expiresIn: "7d" });
    return { user: dto, token };
  }

  return {
    async login(req, res) {
      try {
        const { email, password } = req.body ?? {};
        const record = store.getUserByEmail(email ?? "");
        if (!record || record.password !== password) {
          return res.status(401).json({ message: "Invalid email or password" });
        }
        if (!assertActiveAccount(record, res)) return;
        const { password: _p, ...safe } = record;
        return res.json(signForUser(safe));
      } catch (err) {
        console.error("login", err);
        return res.status(500).json({ message: err?.message ?? "Login failed" });
      }
    },

    async signup(req, res) {
      try {
        const { name, email, password, role } = req.body ?? {};
        if (!name || !email || !password || !role) {
          return res.status(400).json({ message: "Missing fields" });
        }
        if (role === "admin") {
          return res.status(403).json({ message: "Admin accounts are not created through self-service signup." });
        }
        if (!["student", "instructor"].includes(role)) {
          return res.status(400).json({ message: "Invalid role" });
        }
        if (store.getUserByEmail(email)) {
          return res.status(409).json({ message: "Email already registered" });
        }
        const id = `u_${Math.random().toString(36).slice(2, 10)}`;
        const record = { id, name, email, password, role, accountStatus: "pending" };
        await store.withWrite(async () => {
          store.addUser(record);
          store.platformUsers.push({
            id,
            name,
            email,
            role,
            status: "pending",
            lastActive: new Date().toISOString(),
          });
        });
        return res.status(201).json({
          pending: true,
          message: "Registration submitted. An administrator must approve your account before you can sign in.",
        });
      } catch (err) {
        console.error("signup", err);
        return res.status(500).json({ message: err?.message ?? "Signup failed" });
      }
    },
  };
}
