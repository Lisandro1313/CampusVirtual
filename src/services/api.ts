
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  private async handleResponse(response: Response) {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Error de red' }));
      throw new Error(error.error || 'Error en la petición');
    }
    return response.json();
  }

  // Autenticación
  async register(userData: {
    nombre: string;
    email: string;
    password: string;
    rol: string;
    telefono?: string;
    bio?: string;
  }) {
    const response = await fetch(`${API_BASE_URL}/users/register`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(userData)
    });
    return this.handleResponse(response);
  }

  async login(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ email, password })
    });
    return this.handleResponse(response);
  }

  async getProfile() {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  // Clases
  async getClases(filtros?: { categoria?: string; nivel?: string; docente?: string }) {
    const params = new URLSearchParams();
    if (filtros) {
      Object.entries(filtros).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    
    const response = await fetch(`${API_BASE_URL}/clases?${params}`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async getClase(id: string) {
    const response = await fetch(`${API_BASE_URL}/clases/${id}`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async crearClase(claseData: {
    titulo: string;
    descripcion: string;
    categoria: string;
    nivel: string;
    precio: number;
    duracion: number;
    etiquetas: string;
    imagen?: string;
  }) {
    const response = await fetch(`${API_BASE_URL}/clases`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(claseData)
    });
    return this.handleResponse(response);
  }

  async getMisClases() {
    const response = await fetch(`${API_BASE_URL}/clases/mis-clases`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async subirMaterial(claseId: string, formData: FormData) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/clases/${claseId}/material`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` })
      },
      body: formData
    });
    return this.handleResponse(response);
  }

  async inscribirseClase(claseId: string) {
    const response = await fetch(`${API_BASE_URL}/clases/${claseId}/inscribirse`, {
      method: 'POST',
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  // Pagos
  async crearPreferenciaPago(claseId: string) {
    const response = await fetch(`${API_BASE_URL}/pagos/crear-preferencia`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ claseId })
    });
    return this.handleResponse(response);
  }

  async getEstadoPago(pagoId: string) {
    const response = await fetch(`${API_BASE_URL}/pagos/estado/${pagoId}`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async getHistorialPagos() {
    const response = await fetch(`${API_BASE_URL}/pagos/historial`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }
}

export const apiService = new ApiService();
