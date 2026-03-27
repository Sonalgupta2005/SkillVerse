const API_BASE_URL = 'http://localhost:5000/api';

interface Skill {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface User {
  _id: any;
  id: string;
  email: string;
  name: string;
  avatar?: string;
  completedSwaps: number;
  bio?: string;
  rating: number;
  location?: string;
  profilePhoto?: string;
  skillsOffered: Skill[];
  skillsWanted: Skill[];
  availability?: string[];
  profileVisibility: 'public' | 'private';
  role: 'user' | 'admin';
  banned: boolean;
  createdAt: string;
  updatedAt: string;
  swapId?: string;
  swapStatus?: 'pending' | 'accepted' | 'rejected' | 'cancelled';
  swapUpdatedAt?: string;
}

export interface AuthResponse {
  user?: User;
  message: string;
  success?: boolean;
}
export interface Message {
  _id: string;
  swapId: string;
  sender: {
    _id: string;
    id?: string;
    name: string;
    avatar?: string;
  };
  content: string;
  createdAt: string;
}


class ApiService {
  private getHeaders() {
    return {
      'Content-Type': 'application/json'
    };
  }

  // --- AUTH ---

  async signup(userData: {
    email: string;
    password: string;
    name: string;
    location?: string;
    profilePhoto?: string;
    skillsOffered?: {name: string; level: string}[];
    skillsWanted?: {name: string; level: string}[];
    availability?: string;
  }): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: this.getHeaders(),
        credentials: 'include',
        body: JSON.stringify(userData)
      });
      const data = await response.json();
      return data;
    } catch {
      return { success: false, message: 'Network error. Please try again.' };
    }
  }

  // Note: backend login route is POST /api/auth/login (not signin)
  async signin(credentials: {
    email: string;
    password: string;
  }): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: this.getHeaders(),
        credentials: 'include',
        body: JSON.stringify(credentials)
      });
      const data = await response.json();
      return data;
    } catch {
      return { success: false, message: 'Network error. Please try again.' };
    }
  }

  // Backend logout route: POST /api/auth/logout
  async signout(): Promise<void> {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: this.getHeaders(),
        credentials: 'include'
      });
    } catch (error) {
      console.error('Signout error:', error);
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: this.getHeaders(),
        credentials: 'include'
      });
      if (!response.ok) return null;
      const data = await response.json();
      return data.user || null;
    } catch {
      return null;
    }
  }

  // --- PROFILE ---

  // Update /api/users/me (PUT)
  async updateProfile(profileData: Partial<User>): Promise<{ success: boolean; message: string; user?: User }> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/me`, {
        method: 'PUT',
        headers: this.getHeaders(),
        credentials: 'include',
        body: JSON.stringify(profileData)
      });
      const data = await response.json();
      return data;
    } catch {
      return { success: false, message: 'Failed to update profile. Please try again.' };
    }
  }

  // Toggle visibility: PUT /api/users/me/visibility with { profileVisibility: 'public' | 'private' }
  async toggleProfileVisibility(isPublic: boolean): Promise<{ success: boolean; message: string; user?: User }> {
    try {
      const visibility = isPublic ? 'public' : 'private';
      const response = await fetch(`${API_BASE_URL}/users/me/visibility`, {
        method: 'PUT',
        headers: this.getHeaders(),
        credentials: 'include',
        body: JSON.stringify({ profileVisibility: visibility })
      });
      const data = await response.json();
      return data;
    } catch {
      return { success: false, message: 'Failed to update profile visibility.' };
    }
  }

  // --- USERS (Browsing public profiles) ---

  // GET /api/users?skill=SkillName&page=1&limit=10&search=term
  // Adjust query to support multiple skills and location search
 async getPublicProfiles(filters?: {
  skills?: string[];
  categories?: string[];
  location?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<{ success: boolean; users: User[]; page?: number; pages?: number; total?: number }> {
  try {
    const params = new URLSearchParams();

    // Support multiple skill filters
    if (filters?.skills && filters.skills.length > 0) {
      filters.skills.forEach(skill => params.append('skill', skill));
    }

    if (filters?.categories && filters.categories.length > 0) {
      filters.categories.forEach(category => params.append('category', category));
    }

    if (filters?.location) {
      params.append('search', filters.location);
    }

    if (filters?.search) {
      params.append('search', filters.search);
    }

    if (filters?.page) {
      params.append('page', filters.page.toString());
    }

    if (filters?.limit) {
      params.append('limit', filters.limit.toString());
    }

    const response = await fetch(`${API_BASE_URL}/users?${params.toString()}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch profiles');
    }

    const data = await response.json();

    return {
      success: true,
      users: data.users,
      page: data.page,
      pages: data.pages,
      total: data.total
    };
  } catch (error) {
    console.error('Error in getPublicProfiles:', error);
    return {
      success: false,
      users: []
    };
  }
}


  // GET /api/users/:id for user profile detail (need current user context)
  async getUserById(userId: string): Promise<User | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        headers: this.getHeaders(),
        credentials: 'include'
      });
      if (!response.ok) return null;
      const data = await response.json();
      return data.user || null;
    } catch {
      return null;
    }
  }

  // --- SWAPS ---

  // Create swap request: POST /api/swaps with { toUser, offeredSkill, wantedSkill, message }
  async requestSwap(params: {
    toUser: string;
    offeredSkill: string;
    wantedSkill: string;
    message?: string;
  }): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/swaps`, {
        method: 'POST',
        headers: this.getHeaders(),
        credentials: 'include',
        body: JSON.stringify({
          toUser: params.toUser,
          offeredSkill: params.offeredSkill,
          wantedSkill: params.wantedSkill,
          message: params.message || ''
        })
      });
      console.log('Swap request response:', response);
      if (!response.ok) {
        const errData = await response.json();
        return { success: false, message: errData.message || 'Failed to send swap request.' };
      }
      const data = await response.json();
      return { success: true, message: 'Swap request sent.' };
    } catch {
      return { success: false, message: 'Failed to send swap request. Please try again.' };
    }
  }

  // Get my swaps: GET /api/swaps/me
  async getMySwaps(): Promise<{ sentSwaps: any[]; receivedSwaps: any[] }> {
  try {
    const response = await fetch(`${API_BASE_URL}/swaps/me`, {
      headers: this.getHeaders(),
      credentials: 'include',
    });
    if (!response.ok) {
      return { sentSwaps: [], receivedSwaps: [] };
    }

    const data = await response.json();
    // console.log('My swaps data:', data);
    return {
      sentSwaps: data.sentSwaps || [],
      receivedSwaps: data.receivedSwaps || []
    };
  } catch {
    return { sentSwaps: [], receivedSwaps: [] };
  }
}


  // Update swap: PUT /api/swaps/:id with { status }
  async updateSwapStatus(swapId: string, status: 'pending' | 'accepted' | 'rejected' | 'cancelled'): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/swaps/${swapId}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        credentials: 'include',
        body: JSON.stringify({ status })
      });
      if (!response.ok) {
        const errData = await response.json();
        return { success: false, message: errData.message || 'Failed to update swap status.' };
      }
      return { success: true, message: 'Swap updated.' };
    } catch(err) {
      return { success: false, message: err.message || 'Failed to update swap. Please try again.' };
    }
  }

  // Delete swap: DELETE /api/swaps/:id
  async deleteSwap(swapId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/swaps/${swapId}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
        credentials: 'include'
      });
      if (!response.ok) {
        const errData = await response.json();
        return { success: false, message: errData.message || 'Failed to delete swap.' };
      }
      return { success: true, message: 'Swap deleted.' };
    } catch {
      return { success: false, message: 'Failed to delete swap. Please try again.' };
    }
  }

  // --- FEEDBACK ---

  // POST /api/feedback with { toUser, swapId, message, rating }
  async createFeedback(params: {
    toUser: string;
    swapId: string;
    message?: string;
    rating: number; // 1 to 5
  }): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/feedback`, {
        method: 'POST',
        headers: this.getHeaders(),
        credentials: 'include',
        body: JSON.stringify({
          toUser: params.toUser,
          swapId: params.swapId,
          message: params.message || '',
          rating: params.rating
        })
      });
      if (!response.ok) {
        const errData = await response.json();
        return { success: false, message: errData.message || 'Failed to create feedback.' };
      }
      return { success: true, message: 'Feedback created.' };
    } catch {
      return { success: false, message: 'Failed to create feedback. Please try again.' };
    }
  }

  // Legacy methods for compatibility - remove these once frontend is updated
 async getMessagesBySwapId(
  swapId: string
): Promise<Message[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/swaps/${swapId}/messages`,
      {
        headers: this.getHeaders(),
        credentials: "include"
      }
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data.messages || [];
  } catch {
    return [];
  }
}
async sendMessage(
  swapId: string,
  content: string
): Promise<Message | null> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/swaps/${swapId}/messages`,
      {
        method: "POST",
        headers: this.getHeaders(),
        credentials: "include",
        body: JSON.stringify({ content })
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.message || null;
  } catch {
    return null;
  }
}


}

export const apiService = new ApiService();