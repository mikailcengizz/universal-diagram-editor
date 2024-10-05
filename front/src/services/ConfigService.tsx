import axios from "axios";

const CONFIG_API_BASE_URL = "http://localhost:8080/config";

const headers = {
  Authorization: "Basic " + btoa("test@hotmail.com:test123"),
};

class ConfigService {
  getConfigByFilename(filename: string) {
    return axios.get(CONFIG_API_BASE_URL + "/get-config/" + filename, {
      headers,
    });
  }

  getMetaConfigByUri(uri: string) {
    return axios.get(CONFIG_API_BASE_URL + "/get-meta-config-by-uri/" + uri, {
      headers,
    });
  }

  getRepresentationConfigByUri(uri: string) {
    return axios.get(
      CONFIG_API_BASE_URL + "/get-representation-config-by-uri/" + uri,
      {
        headers,
      }
    );
  }

  getMetaConfigList() {
    return axios.get(CONFIG_API_BASE_URL + "/list", {
      headers,
    });
  }
}

const configService = new ConfigService();

export default configService;
