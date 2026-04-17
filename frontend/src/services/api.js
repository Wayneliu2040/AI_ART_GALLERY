import { mockCommentsByImageId, mockImages } from './mockData.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
const ENABLE_MOCKS = import.meta.env.VITE_ENABLE_MOCKS !== 'false';
const STORAGE_KEY = 'ai_art_gallery_user';

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function getStoredToken() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return '';
    }

    const user = JSON.parse(raw);
    return user?.token || '';
  } catch {
    return '';
  }
}

async function parseJson(response) {
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.message || 'Request failed.');
  }

  return data;
}

async function request(path, options = {}) {
  const token = getStoredToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    },
    ...options
  });

  return parseJson(response);
}

function matchesFilters(image, { keyword = '', tag = 'all', onlyMine = false, userEmail = '', userName = '' }) {
  const normalized = keyword.trim().toLowerCase();
  const searchable =
    `${image.title} ${image.tag} ${image.prompt} ${image.description} ${image.authorName}`.toLowerCase();
  const keywordMatch = !normalized || searchable.includes(normalized);
  const tagMatch = tag === 'all' || image.tag === tag;
  const identity = getUserIdentity({ email: userEmail, name: userName });
  const ownerMatch = !onlyMine || image.authorName.toLowerCase() === identity.toLowerCase();
  return keywordMatch && tagMatch && ownerMatch;
}

function getUserIdentity(user = {}) {
  if (user?.name?.trim()) {
    return user.name.trim();
  }

  if (user?.email?.includes('@')) {
    return user.email.split('@')[0];
  }

  return user?.email || 'Guest';
}

function sortByNewest(images) {
  return [...images].sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime());
}

let localImages = [...mockImages];
let localComments = JSON.parse(JSON.stringify(mockCommentsByImageId));

export const authApi = {
  async login({ email, password }) {
    if (!ENABLE_MOCKS) {
      return request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
    }

    await wait(400);

    if (email === 'demo@aiartgallery.app' && password === 'Password123!') {
      return {
        email,
        name: 'Demo User',
        token: 'demo-jwt-token'
      };
    }

    throw new Error('Invalid credentials. Use demo@aiartgallery.app / Password123! for the demo account.');
  },

  async register({ name, email, password }) {
    if (!ENABLE_MOCKS) {
      return request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password })
      });
    }

    await wait(500);

    return {
      email,
      name,
      token: 'demo-jwt-token'
    };
  }
};

export const imageApi = {
  async list(filters = {}, currentUser) {
    if (!ENABLE_MOCKS) {
      if (filters.onlyMine) {
        return request('/users/me/images');
      }

      const params = new URLSearchParams();
      if (filters.keyword) {
        params.set('q', filters.keyword);
      }
      if (filters.tag && filters.tag !== 'all') {
        params.set('tag', filters.tag);
      }

      const query = params.toString();
      return request(`/images${query ? `?${query}` : ''}`);
    }

    await wait(350);
    return sortByNewest(
      localImages.filter((image) =>
        matchesFilters(image, {
          ...filters,
          userEmail: currentUser?.email || '',
          userName: currentUser?.name || ''
        })
      )
    );
  },

  async getById(imageId) {
    if (!ENABLE_MOCKS) {
      return request(`/images/${imageId}`);
    }

    await wait(250);
    const image = localImages.find((item) => String(item.id) === String(imageId));
    if (!image) {
      throw new Error('Image not found.');
    }
    return image;
  },

  async upload(payload, currentUser) {
    if (!ENABLE_MOCKS) {
      const formData = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });

      const response = await fetch(`${API_BASE_URL}/images`, {
        method: 'POST',
        headers: {
          ...(getStoredToken() ? { Authorization: `Bearer ${getStoredToken()}` } : {})
        },
        body: formData
      });

      return parseJson(response);
    }

    await wait(600);

    const nextImage = {
      id: Date.now(),
      title: payload.title,
      tag: payload.tag,
      description: payload.description,
      platform: payload.platform,
      likes: 0,
      commentsCount: 0,
      createdAt: new Date().toISOString(),
      authorName: currentUser?.name || 'You',
      prompt: payload.prompt,
      imageUrl:
        payload.file instanceof File ? URL.createObjectURL(payload.file) : 'https://via.placeholder.com/600x400'
    };

    localImages = [nextImage, ...localImages];
    localComments[nextImage.id] = [];
    return nextImage;
  },

  async addLike(imageId) {
    if (!ENABLE_MOCKS) {
      return request(`/images/${imageId}/like`, {
        method: 'POST'
      });
    }

    await wait(180);
    localImages = localImages.map((image) =>
      String(image.id) === String(imageId) ? { ...image, likes: image.likes + 1 } : image
    );
    return localImages.find((image) => String(image.id) === String(imageId));
  },

  async getUserSummary(currentUser) {
    if (!ENABLE_MOCKS) {
      return request('/users/me/summary');
    }

    await wait(200);
    const identity = getUserIdentity(currentUser).toLowerCase();
    const myImages = localImages.filter((image) => image.authorName.toLowerCase() === identity);
    const receivedLikes = myImages.reduce((total, image) => total + (image.likes || 0), 0);
    const receivedComments = myImages.reduce((total, image) => total + (image.commentsCount || 0), 0);

    return {
      uploadCount: myImages.length,
      receivedLikes,
      receivedComments
    };
  }
};

export const commentApi = {
  async list(imageId) {
    if (!ENABLE_MOCKS) {
      return request(`/images/${imageId}/comments`);
    }

    await wait(200);
    return localComments[imageId] || [];
  },

  async create(imageId, content, currentUser) {
    if (!ENABLE_MOCKS) {
      return request(`/images/${imageId}/comments`, {
        method: 'POST',
        body: JSON.stringify({ content })
      });
    }

    await wait(220);
    const nextComment = {
      id: Date.now(),
      authorName: currentUser?.name || 'You',
      content,
      createdAt: new Date().toISOString()
    };

    const existing = localComments[imageId] || [];
    localComments[imageId] = [nextComment, ...existing];
    localImages = localImages.map((image) =>
      String(image.id) === String(imageId)
        ? { ...image, commentsCount: (image.commentsCount || 0) + 1 }
        : image
    );

    return nextComment;
  }
};
