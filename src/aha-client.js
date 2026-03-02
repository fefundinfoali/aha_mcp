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
    const featureData = this._transformFeatureData(data);
    return this.request('POST', `/products/${productId}/features`, { feature: featureData });
  }

  async updateFeature(featureId, data) {
    const featureData = this._transformFeatureData(data);
    delete featureData.feature_id;
    return this.request('PUT', `/features/${featureId}`, { feature: featureData });
  }

  // Transform feature data to Aha! API format
  _transformFeatureData(data) {
    const result = { ...data };
    
    // Handle workflow status
    if (result.workflow_status) {
      result.workflow_status = { name: result.workflow_status };
    }
    
    // Handle epic linking
    if (result.epic_id) {
      result.epic = { reference_num: result.epic_id };
      delete result.epic_id;
    }
    
    // Handle initiative linking
    if (result.initiative_id) {
      result.initiative = { reference_num: result.initiative_id };
      delete result.initiative_id;
    }
    
    // Handle release linking
    if (result.release_id) {
      result.release = { reference_num: result.release_id };
      delete result.release_id;
    }
    
    // Remove product_id from payload
    delete result.product_id;
    
    return result;
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
    const ideaData = this._transformIdeaData(data);
    return this.request('POST', `/products/${productId}/ideas`, { idea: ideaData });
  }

  async updateIdea(ideaId, data) {
    const ideaData = this._transformIdeaData(data);
    delete ideaData.idea_id;
    return this.request('PUT', `/ideas/${ideaId}`, { idea: ideaData });
  }

  _transformIdeaData(data) {
    const result = { ...data };
    if (result.workflow_status) {
      result.workflow_status = { name: result.workflow_status };
    }
    delete result.product_id;
    return result;
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
    const releaseData = { ...data };
    delete releaseData.product_id;
    return this.request('POST', `/products/${productId}/releases`, { release: releaseData });
  }

  async updateRelease(releaseId, data) {
    const releaseData = { ...data };
    delete releaseData.release_id;
    return this.request('PUT', `/releases/${releaseId}`, { release: releaseData });
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
    const goalData = { ...data };
    delete goalData.product_id;
    return this.request('POST', `/products/${productId}/goals`, { goal: goalData });
  }

  async updateGoal(goalId, data) {
    const goalData = { ...data };
    delete goalData.goal_id;
    return this.request('PUT', `/goals/${goalId}`, { goal: goalData });
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
    const initiativeData = this._transformInitiativeData(data);
    return this.request('POST', `/products/${productId}/initiatives`, { initiative: initiativeData });
  }

  async updateInitiative(initiativeId, data) {
    const initiativeData = this._transformInitiativeData(data);
    // Remove initiative_id from the payload
    delete initiativeData.initiative_id;
    return this.request('PUT', `/initiatives/${initiativeId}`, { initiative: initiativeData });
  }

  // Transform initiative data to Aha! API format
  _transformInitiativeData(data) {
    const result = { ...data };
    
    // Handle workflow status
    if (result.workflow_status) {
      result.workflow_status = { name: result.workflow_status };
    }
    
    // Handle goal linking
    if (result.goal_id) {
      result.goals = [{ reference_num: result.goal_id }];
      delete result.goal_id;
    }
    
    // Handle score (standard field, not custom)
    if (result.value_score !== undefined) {
      result.score = result.value_score;
      delete result.value_score;
    }
    
    // Handle custom fields - use object format
    const customFieldMapping = {
      tshirt_size: 'tshirt_size',
      gtm_priority: 'g2m_priority',
      customer_facing: 'customer_facing',
      layercake_category: 'layercake_category'
    };
    
    const customFields = {};
    for (const [inputKey, ahaKey] of Object.entries(customFieldMapping)) {
      if (result[inputKey] !== undefined) {
        customFields[ahaKey] = result[inputKey];
        delete result[inputKey];
      }
    }
    
    if (Object.keys(customFields).length > 0) {
      result.custom_fields = customFields;
    }
    
    return result;
  }

  // ============ EPICS ============
  async listEpics(productId, page = 1, perPage = 30) {
    return this.request('GET', `/products/${productId}/epics?page=${page}&per_page=${perPage}`);
  }

  async getEpic(epicId) {
    return this.request('GET', `/epics/${epicId}`);
  }

  async createEpic(productId, data) {
    const epicData = { ...data };
    // Transform initiative_id to initiative for Aha API
    if (epicData.initiative_id) {
      epicData.initiative = { reference_num: epicData.initiative_id };
      delete epicData.initiative_id;
    }
    // Remove product_id from the payload
    delete epicData.product_id;
    return this.request('POST', `/products/${productId}/epics`, { epic: epicData });
  }

  async updateEpic(epicId, data) {
    // Transform initiative_id to initiative for Aha API
    const epicData = { ...data };
    if (epicData.initiative_id) {
      epicData.initiative = { reference_num: epicData.initiative_id };
      delete epicData.initiative_id;
    }
    // Remove epic_id from the payload
    delete epicData.epic_id;
    return this.request('PUT', `/epics/${epicId}`, { epic: epicData });
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
    const reqData = this._transformRequirementData(data);
    return this.request('POST', `/features/${featureId}/requirements`, { requirement: reqData });
  }

  async updateRequirement(requirementId, data) {
    const reqData = this._transformRequirementData(data);
    delete reqData.requirement_id;
    return this.request('PUT', `/requirements/${requirementId}`, { requirement: reqData });
  }

  _transformRequirementData(data) {
    const result = { ...data };
    if (result.workflow_status) {
      result.workflow_status = { name: result.workflow_status };
    }
    delete result.feature_id;
    return result;
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

  // ============ ENRICHED GET METHODS ============
  // These fetch the parent record + nested children in parallel

  async getFeatureEnriched(featureId) {
    const [featureRes, reqRes] = await Promise.all([
      this.request('GET', `/features/${featureId}`),
      this.request('GET', `/features/${featureId}/requirements`).catch(() => ({ requirements: [] }))
    ]);
    const feature = featureRes.feature;
    if (feature) {
      feature._requirements = reqRes.requirements || [];
    }
    return featureRes;
  }

  async getEpicEnriched(epicId) {
    const [epicRes, featRes] = await Promise.all([
      this.request('GET', `/epics/${epicId}`),
      this.request('GET', `/epics/${epicId}/features`).catch(() => ({ features: [] }))
    ]);
    const epic = epicRes.epic;
    if (epic) {
      epic._features = featRes.features || [];
    }
    return epicRes;
  }

  async getInitiativeEnriched(initiativeId) {
    const [initRes, featRes] = await Promise.all([
      this.request('GET', `/initiatives/${initiativeId}`),
      this.request('GET', `/initiatives/${initiativeId}/features`).catch(() => ({ features: [] }))
    ]);
    const initiative = initRes.initiative;
    if (initiative) {
      initiative._features = featRes.features || [];
      // Derive unique epics from feature.epic references
      const epicMap = {};
      for (const f of initiative._features) {
        if (f.epic && f.epic.id && !epicMap[f.epic.id]) {
          epicMap[f.epic.id] = {
            id: f.epic.id,
            reference_num: f.epic.reference_num,
            name: f.epic.name
          };
        }
      }
      initiative._epics = Object.values(epicMap);
    }
    return initRes;
  }

  // ============ TAGS ============
  async listTags(productId) {
    return this.request('GET', `/products/${productId}/tags`);
  }
}
