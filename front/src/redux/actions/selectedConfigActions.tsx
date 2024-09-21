export const UPDATE_SELECTED_CONFIG = "UPDATE_SELECTED_CONFIG";

export const updateSelectedConfig = (config: string | null) => ({
  type: UPDATE_SELECTED_CONFIG,
  payload: config,
});
