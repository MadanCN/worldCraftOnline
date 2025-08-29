export interface User {
  id: string;
  email: string;
  username: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export interface World {
  id: string;
  name: string;
  description: string | null;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
  characters?: Character[];
  locations?: Location[];
  events?: Event[];
}

export interface Character {
  id: string;
  name: string;
  role: string | null;
  description: string | null;
  imageUrl: string | null;
  worldId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Location {
  id: string;
  name: string;
  type: string | null;
  description: string | null;
  imageUrl: string | null;
  parentId: string | null;
  worldId: string;
  createdAt: string;
  updatedAt: string;
  children?: Location[];
}

export interface Event {
  id: string;
  name: string;
  date: string | null;
  description: string | null;
  worldId: string;
  createdAt: string;
  updatedAt: string;
}
