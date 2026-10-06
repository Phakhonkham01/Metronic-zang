import { ID } from "../../_metronic/helpers";
import type {
  AuthUser,
  LoginResponse,
  User,
  UsersQueryResponse,
} from "../types";

/**
 * Mock backend ສຳລັບ dev ໂດຍບໍ່ຕ້ອງມີ server.
 * ເປີດໃຊ້ດ້ວຍ VITE_USE_MOCK_API=true. ຂໍ້ມູນເກັບໃນ localStorage.
 * Default account: test / 123456
 */
type StoredUser = User & { id: number; password: string };

const DB_KEY = "mock-users-db";
const TOKEN_PREFIX = "mock-token-";

const seed: StoredUser[] = [
  {
    id: 1,
    username: "test",
    password: "123456",
    name: "Test User",
    email: "test@example.com",
    role: "admin",
    created_at: new Date().toISOString(),
  },
];

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

const readDb = (): StoredUser[] => {
  const raw = localStorage.getItem(DB_KEY);
  if (!raw) {
    localStorage.setItem(DB_KEY, JSON.stringify(seed));
    return [...seed];
  }
  return JSON.parse(raw) as StoredUser[];
};

const writeDb = (users: StoredUser[]) =>
  localStorage.setItem(DB_KEY, JSON.stringify(users));

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const stripPassword = ({ password, ...rest }: StoredUser): User => rest;

const toAuthUser = (u: StoredUser): AuthUser => ({
  id: u.id,
  username: u.username ?? "",
  name: u.name ?? "",
  email: u.email ?? "",
  role: u.role ?? "user",
});

export const mockAuthAPI = {
  login: async (username: string, password: string): Promise<LoginResponse> => {
    await delay();
    const user = readDb().find(
      (u) => u.username === username && u.password === password
    );
    if (!user) throw new Error("Username or password is incorrect");
    return { token: `${TOKEN_PREFIX}${user.id}`, user: toAuthUser(user) };
  },

  me: async (): Promise<AuthUser> => {
    await delay(100);
    const token = localStorage.getItem("token") ?? "";
    const id = Number(token.replace(TOKEN_PREFIX, ""));
    const user = readDb().find((u) => u.id === id);
    if (!user) throw new Error("Invalid token");
    return toAuthUser(user);
  },
};

export const mockUserAPI = {
  getUsers: async (query: string): Promise<UsersQueryResponse> => {
    await delay();
    const params = new URLSearchParams(query);
    const search = (params.get("search") ?? "").toLowerCase();
    const role = params.get("filter_role");
    const sort = params.get("sort") as keyof User | null;
    const order = params.get("order");

    let users = readDb();
    if (search) {
      users = users.filter((u) =>
        [u.username, u.name, u.email].some((v) =>
          v?.toLowerCase().includes(search)
        )
      );
    }
    if (role) users = users.filter((u) => u.role === role);
    if (sort) {
      users.sort((a, b) => {
        const res = String(a[sort] ?? "").localeCompare(String(b[sort] ?? ""));
        return order === "desc" ? -res : res;
      });
    }
    return { data: users.map(stripPassword) };
  },

  getUserById: async (id: ID): Promise<User | undefined> => {
    await delay(100);
    const user = readDb().find((u) => u.id === id);
    return user ? stripPassword(user) : undefined;
  },

  createUser: async (user: User): Promise<User | undefined> => {
    await delay();
    const users = readDb();
    if (users.some((u) => u.username === user.username)) {
      throw new Error("Username already exists");
    }
    const created: StoredUser = {
      ...user,
      id: Math.max(0, ...users.map((u) => u.id)) + 1,
      password: user.password ?? "",
      created_at: new Date().toISOString(),
    };
    writeDb([...users, created]);
    return stripPassword(created);
  },

  updateUser: async (user: User): Promise<User | undefined> => {
    await delay();
    const users = readDb();
    const idx = users.findIndex((u) => u.id === user.id);
    if (idx < 0) throw new Error("User not found");
    if (users.some((u) => u.username === user.username && u.id !== user.id)) {
      throw new Error("Username already exists");
    }
    users[idx] = {
      ...users[idx],
      ...user,
      id: users[idx].id,
      password: user.password || users[idx].password,
    };
    writeDb(users);
    return stripPassword(users[idx]);
  },

  deleteUser: async (id: ID): Promise<void> => {
    await delay();
    writeDb(readDb().filter((u) => u.id !== id));
  },

  deleteSelectedUsers: async (ids: Array<ID>): Promise<void> => {
    await delay();
    writeDb(readDb().filter((u) => !ids.includes(u.id)));
  },
};
