// Aha API Client with full CRUD support

export class AhaClient {
  constructor(company, token) {
    this.baseUrl = `https://${company}.aha.io/api/v1`;
    this.token = token;
  }

  async request(method, path, body = null) {
    const url = `${this.baseUrl}${path}`;
    const options = {
      method,
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };

    if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Aha API error (${response.status}): ${errorText}`);
    }

    // Handle 204 No Content for DELETE
    if (response.status === 204) {
      return { success: true };
    }

    return response.json();
  }

  // ============ PRODUCTS ============
  async listProducts(page = 1, perPage = 30) {
    return this.request('GET', `/products?page=${page}&per_page=${perPage}`);
  }

  async getProduct(productId) {
    return this.request('GET', `/products/${productId}`);
  }

  // ============ FEATURES ============
  async listFeatures(productId, page = 1, perPage = 30) {
    return this.request('GET', `/products/${productId}/features?page=${page}&per_page=${perPage}`);
  }

  async getFeature(featureId) {
    return this.request('GET', `/features/${featureId}`);
  }

  async searchFeatures(productId, query) {
    return this.request('GET', `/products/${productId}/features?q=${encodeURIComponent(query)}`);
  }

  async createFeature(productId, data) {
    return this.request('POST', `/products/${productId}/features`, { feature: data });
  }

  async updateFeature(featureId, data) {
    return this.request('PUT', `/features/${featureId}`, { feature: data });
  }

  async deleteFeature(featureId) {
    return this.request('DELETE', `/features/${featureId}`);
  }

  // ============ IDEAS ============
  async listIdeas(productId, page = 1, perPage = 30) {
    return this.request('GET', `/products/${productId}/ideas?page=${page}&per_page=${perPage}`);
  }

  async getIdea(ideaId) {
    return this.request('GET', `/ideas/${ideaId}`);
  }

  async searchIdeas(productId, query) {
    return this.request('GET', `/products/${productId}/ideas?q=${encodeURIComponent(query)}`);
  }

  async createIdea(productId, data) {
    return this.request('POST', `/products/${productId}/ideas`, { idea: data });
  }

  async updateIdea(ideaId, data) {
    return this.request('PUT', `/ideas/${ideaId}`, { idea: data });
  }

  async deleteIdea(ideaId) {
    return this.request('DELETE', `/ideas/${ideaId}`);
  }

  // ============ RELEASES ============
  async listReleases(productId) {
    return this.request('GET', `/products/${productId}/releases`);
  }

  async getRelease(releaseId) {
    return this.request('GET', `/releases/${releaseId}`);
  }

  async createRelease(productId, data) {
    return this.request('POST', `/products/${productId}/releases`, { release: data });
  }

  async updateRelease(releaseId, data) {
    return this.request('PUT', `/releases/${releaseId}`, { release: data });
  }

  async deleteRelease(releaseId) {
    return this.request('DELETE', `/releases/${releaseId}`);
  }

  // ============ GOALS ============
  async listGoals(productId) {
    return this.request('GET', `/products/${productId}/goals`);
  }

  async getGoal(goalId) {
    return this.request('GET', `/goals/${goalId}`);
  }

  async createGoal(productId, data) {
    return this.request('POST', `/products/${productId}/goals`, { goal: data });
  }

  async updateGoal(goalId, data) {
    return this.request('PUT', `/goals/${goalId}`, { goal: data });
  }

  // ============ INITIATIVES ============
  async listInitiatives(productId) {
    return this.request('GET', `/products/${productId}/initiatives`);
  }

  async getInitiative(initiativeId) {
    return this.request('GET', `/initiatives/${initiativeId}`);
  }

  async getInitiativeFeatures(initiativeId) {
    return this.request('GET', `/initiatives/${initiativeId}/features`);
  }

  async createInitiative(productId, data) {
    return this.request('POST', `/products/${productId}/initiatives`, { initiative: data });
  }

  async updateInitiative(initiativeId, data) {
    return this.request('PUT', `/initiatives/${initiativeId}`, { initiative: data });
  }

  // ============ EPICS ============
  async listEpics(productId, page = 1, perPage = 30) {
    return this.request('GET', `/products/${productId}/epics?page=${page}&per_page=${perPage}`);
  }

  async getEpic(epicId) {
    return this.request('GET', `/epics/${epicId}`);
  }

  async createEpic(productId, data) {
    return this.request('POST', `/products/${productId}/epics`, { epic: data });
  }

  async updateEpic(epicId, data) {
    return this.request('PUT', `/epics/${epicId}`, { epic: data });
  }

  async deleteEpic(epicId) {
    return this.request('DELETE', `/epics/${epicId}`);
  }

  // ============ REQUIREMENTS ============
  async listRequirements(featureId) {
    return this.request('GET', `/features/${featureId}/requirements`);
  }

  async getRequirement(requirementId) {
    return this.request('GET', `/requirements/${requirementId}`);
  }

  async createRequirement(featureId, data) {
    return this.request('POST', `/features/${featureId}/requirements`, { requirement: data });
  }

  async updateRequirement(requirementId, data) {
    return this.request('PUT', `/requirements/${requirementId}`, { requirement: data });
  }

  async deleteRequirement(requirementId) {
    return this.request('DELETE', `/requirements/${requirementId}`);
  }

  // ============ COMMENTS ============
  async listComments(recordType, recordId) {
    return this.request('GET', `/${recordType}/${recordId}/comments`);
  }

  async createComment(recordType, recordId, body) {
    return this.request('POST', `/${recordType}/${recordId}/comments`, { comment: { body } });
  }

  // ============ USERS ============
  async listUsers() {
    return this.request('GET', '/users');
  }

  async getUser(userId) {
    return this.request('GET', `/users/${userId}`);
  }

  // ============ WORKFLOWS ============
  async getWorkflowStatuses(productId) {
    return this.request('GET', `/products/${productId}/workflow_statuses`);
  }

  // ============ TAGS ============
  async listTags(productId) {
    return this.request('GET', `/products/${productId}/tags`);
  }
}
