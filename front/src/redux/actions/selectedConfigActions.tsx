export const UPDATE_SELECTED_CONFIG = "UPDATE_SELECTED_CONFIG";

export const updateSelectedConfig = (config: string) => ({
  type: UPDATE_SELECTED_CONFIG,
  payload: config,
});
